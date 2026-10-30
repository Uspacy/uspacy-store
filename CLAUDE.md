# CLAUDE.md

`@uspacy/store` — the shared Redux Toolkit store (slices + async thunks over `@uspacy/sdk`) used by every Uspacy
microfrontend. No backend, database or Docker here: it is a webpack-built library published to GitHub Packages.

## Setup

```sh
export NPM_AUTH_TOKEN=<github token>    # REQUIRED: .npmrc interpolates it; yarn install fails without it
                                        # ("Failed to replace env in config"). A real token is needed for @uspacy/* packages.
yarn install --frozen-lockfile          # Yarn 1 (yarn.lock); `prepare` installs the husky pre-commit hook
yarn build                              # webpack -> lib/ (one .js + .d.ts per src file)
```

- Node: the version in the GitHub Actions variable `CORE_TAG` (22.23.4 as of 2026-10); no `.nvmrc` on purpose.
- `yarn dev` — wipes `lib/`, then webpack dev server on `http://localhost:4001` writing a dev build to `lib/` on every change.
- `yarn build:docs` — TypeDoc into `docs/` (GitHub Pages from `main` via CI). `lib/`, `docs/`, `.env` are gitignored.

Trying a change inside a consumer app (`crm-frontend`, `tasks-frontend`, ...) before publishing — copy the build in,
do not `yarn link` (a symlink makes the app resolve `@uspacy/sdk` / `react-redux` from this repo's node_modules):

```sh
yarn build
rsync -a --delete lib/ ../<app>/node_modules/@uspacy/store/lib/
# also into ../<app>/node_modules/@uspacy/common/node_modules/@uspacy/store/lib/ if that nested copy exists
rm -rf ../<app>/node_modules/.cache   # webpack's cache keys node_modules by package version and won't see the copy
```

Then restart the app's dev server. Restore the original packages afterwards (~30s; also clears the stale cache):
`cd ../<app> && rm -rf node_modules/@uspacy/store node_modules/@uspacy/common/node_modules/@uspacy/store node_modules/.cache && yarn install --check-files --frozen-lockfile`.

## Verification

Run before every commit; all must exit 0:

```sh
yarn eslint          # eslint src --max-warnings=0
yarn typecheck       # tsc --noEmit
yarn build           # catches webpack/ts-loader failures
```

- `yarn eslint:fix` autofixes `src`. `--max-warnings=0`: warnings (unsorted imports, unused vars, `console`) fail it.
  `lib/` and `docs/` are ignored in `.eslintrc.js`, so editors and `eslint .` do not report the build output.
- The husky pre-commit hook runs the same rules only on staged `*.{ts,tsx,js}` via lint-staged.
- CI on PRs to `main` runs `yarn build` and `yarn eslint`, and checks the `package.json` version is unpublished.
  CI does not run at all while the PR has a merge conflict with `main` — merge `main` in first.
- There is no test suite. Do not add test tooling unless the developer asks for it.

## Conventions

- **One store for all microfrontends.** `src/store/provider.tsx` creates the `store` singleton at import time, and
  hosts share `@uspacy/store` as a Module Federation `singleton` (see `config/const.js` in `container-frontend`).
  `@uspacy/sdk`, `@reduxjs/toolkit`, `react-redux`, `react` are devDependencies here — the host provides them.
- **Public API = file paths and state shape.** Consumers deep-import `@uspacy/store/lib/hooks/...`,
  `lib/store/<slice>/actions`, `lib/store/<slice>`, `lib/helpers/...` (~1200 imports across the frontends) and select
  `state.<key>` directly. Renaming/moving a file under `src`, renaming a key in `rootReducer` (`src/store/index.ts`,
  including oddities like `messengerReducer`, `migrationsReducer`) or a field in a slice state, or removing/renaming
  an exported action, breaks other repos: agree it with the developer first. Prefer adding.
- Layout:
  - `src/store/<slice>/{index.ts,actions.ts,types.ts}` — `createSlice` in `index.ts` (default export = reducer,
    named exports = sync actions), `createAsyncThunk`s in `actions.ts` typed `'<slice path>/<action>'` (e.g. `'tasks/getTasks'`), state and payload
    types in `types.ts`. Thunks call `uspacySdk.<service>` and return `res.data`, or `thunkAPI.rejectWithValue(e)`.
    Thunks that take an `AbortSignal` return `{ aborted: true }` instead of rejecting when the signal was aborted.
  - `src/store/crm/<part>` — the current CRM store (entities, items, fields, funnels...), combined into `state.crm`.
    Put new CRM state there. The top-level `crmLeads`, `crmDeals`, `crmContacts`, `crmCompanies`, ... slices are
    legacy (untouched since 2024) but still imported by consumers — do not extend them, and do not remove or
    migrate them unless the task says so.
  - A new slice is not in the store until it is added to `combineReducers` in `src/store/index.ts`.
  - `src/hooks/redux.ts` — `useAppDispatch`, `useAppSelector`, `useMemoizedAppSelector` (deep-equal memo).
  - `src/helpers/` — pure helpers; `src/const.ts` — static field definitions (`idColumn`, `fieldsForTasks`, ...).
- **Release order.** Frontend developers release the shared packages themselves (`uspacy-js-sdk`, `uspacy-store`,
  `uspacy-frontend-common`). Order matters: `@uspacy/sdk` first, then `@uspacy/store` with its exact `@uspacy/sdk`
  version in `devDependencies` bumped to that release (commits titled "up sdk"), then `@uspacy/common` if it needs
  the updated ones. While work is pre-QA, publish alphas (see `stage` below) and point the consumer app at them, plus
  `container-frontend` whenever `sdk` or `store` changed. For prod, bump +1 from `main` and release. Consumers pin
  exact versions — no ranges.
- **Do not change without the developer's explicit approval:**
  - `setupStore` / `provider.tsx` / `hydrate.ts` / `startupCacheMiddleware.ts` (startup cache). Read the comments in
    `hydrate.ts` and `startupCacheMiddleware.ts` before touching them: the "only fill an untouched slice" check and the
    `ignoredActions` list are deliberate.
  - Persisted identifiers: IndexedDB `Uspacy` (shared with `@uspacy/sdk`), store `startup-cache`, keys
    `users` / `departments` / `entities`.
  - Build/publish config: `package.json` `main` / `types` / `files`, `tsconfig.json`, `webpack.config.js` (every
    `src/**/*.{ts,tsx}` is its own entry — that is what makes deep imports work), `.npmrc`, `.github/workflows/*`.
- **Versioning.** Every PR to `main` bumps the patch `version` in `package.json` (0.0.377 -> 0.0.378); the
  `check-version` workflow fails otherwise, and merging to `main` auto-publishes. If `main` has meanwhile
  released your number, merge `main` in and bump again.
- **`stage` branch** publishes with the `alpha` dist-tag. Merge into `stage` only when the developer says so.
  Alpha versions use the format `0.0.999-alpha.N` and go up by one: `0.0.999-alpha.373` -> `0.0.999-alpha.374`.
- Traps:
  - `strictNullChecks` and `noImplicitAny` are off, so tsc will not catch null/undefined bugs.
  - `serializableCheck` is disabled, so non-serializable values in state or actions are not reported.
- **Never commit or push without the developer's explicit confirmation** — ask every time, even after earlier approvals.
- **Never force-push** (`--force`, `--force-with-lease`, `+refspec`). If a push is rejected, stop and ask the developer.
- **Always commit the normal way.** Never skip or disable git hooks: no `--no-verify` / `-n` (incl. combined flags like
  `-nm`), `HUSKY=0`, `-c core.hooksPath=...` or similar. If a hook fails, fix the cause; if you cannot, stop and ask.
- **Git naming.** Branches: `feat/<ticket>_<short_name>` or `fix/<ticket>_<short_name>`, where `<ticket>`
  is the Uspacy task number. PR title: `[<ticket>]: <short summary of the PR>`; take the number from the
  branch name, and if it is not there, ask the developer. Commit message: a short description of what this
  specific commit does, with no ticket prefix.
- All PR titles and descriptions, commit messages, and replies to review comments are written in English, regardless of the language of the prompt or the conversation.
