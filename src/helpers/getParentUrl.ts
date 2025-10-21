const ORIGIN_RE = /^([a-z]+:\/\/[^/]+)(\/.*)?$/i;
const STRIP_HASH_RE = /#.*$/;
const STRIP_QUERY_RE = /\?.*$/;
const TRIM_SLASHES_RE = /^\/+|\/+$/g;
const LAST_SEGMENT_RE = /\/[^/]+$/;

const ALREADY_CRM_ENTITY_RE = /^crm\/[^/]+\/?$/;
const ALREADY_CRM_TASKS_RE = /^crm\/tasks\/?$/;
const ALREADY_TASKS_RE = /^tasks\/?$/;
const ALREADY_GROUP_TASKS_RE = /^company\/groups\/[^/]+\/tasks\/?$/;

const COMPANY_GROUP_TASK_WITH_ID = /^company\/groups\/[^/]+\/tasks\/[^/]+$/;
const CRM_ACTIVITIES_WITH_ID = /^crm\/activities\/[^/]+$/;
const CRM_ENTITY_CREATE_EDIT_RE = /^crm\/[^/]+\/(?:create|edit)(?:\/[^/]+)?$/;
const CRM_ENTITY_WITH_ID_RE = /^crm\/[^/]+\/[^/]+$/;
const TASKS_WITH_ID_RE = /^tasks\/[^/]+$/;

type Options = { keepOrigin?: boolean; keepQuery?: boolean };

export const getParentUrl = (rawUrl: string, { keepOrigin = true, keepQuery = false }: Options = {}): string => {
	const input = String(rawUrl).trim();

	const originMatch = input.match(ORIGIN_RE);
	const origin = originMatch ? originMatch[1] : '';
	const afterOrigin = originMatch ? originMatch[2] ?? '/' : input;

	const noHash = afterOrigin.replace(STRIP_HASH_RE, '');
	const query = (noHash.match(STRIP_QUERY_RE) ?? [''])[0];
	const noQuery = noHash.replace(STRIP_QUERY_RE, '');

	const clean = noQuery.replace(TRIM_SLASHES_RE, '');
	const base = (p: string) => (keepOrigin && origin ? origin : '') + p + (keepQuery ? query : '');

	if (!clean) return base('/');

	if (ALREADY_CRM_ENTITY_RE.test(clean)) return base('/' + clean.replace(/\/$/, ''));
	if (ALREADY_CRM_TASKS_RE.test(clean)) return base('/crm/tasks');
	if (ALREADY_TASKS_RE.test(clean)) return base('/tasks');
	if (ALREADY_GROUP_TASKS_RE.test(clean)) return base('/' + clean.replace(/\/?$/, '/'));

	if (COMPANY_GROUP_TASK_WITH_ID.test(clean)) {
		return base('/' + clean.replace(LAST_SEGMENT_RE, '/'));
	}

	if (CRM_ACTIVITIES_WITH_ID.test(clean)) {
		return base('/crm/tasks');
	}

	if (CRM_ENTITY_CREATE_EDIT_RE.test(clean)) {
		return base('/' + clean.replace(/^(crm\/[^/]+)\/.*$/, '$1'));
	}

	if (CRM_ENTITY_WITH_ID_RE.test(clean)) {
		return base('/' + clean.replace(/^(crm\/[^/]+)\/[^/]+$/, '$1'));
	}

	if (TASKS_WITH_ID_RE.test(clean)) {
		return base('/tasks');
	}

	const trimmed = clean.replace(LAST_SEGMENT_RE, '');
	return base(trimmed ? '/' + trimmed : '/');
};
