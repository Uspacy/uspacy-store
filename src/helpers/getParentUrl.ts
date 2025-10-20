const ORIGIN_RE = /^([a-z]+:\/\/[^/]+)(\/.*)?$/i;
const STRIP_HASH_RE = /#.*$/;
const STRIP_QUERY_RE = /\?.*$/;
const TRIM_SLASHES_RE = /^\/+|\/+$/g;
const LAST_SEGMENT_RE = /\/[^/]+$/;

const COMPANY_GROUP_TASK_RE = /^company\/groups\/[^/]+\/tasks\/[^/]+$/;
const CRM_ACTIVITIES_RE = /^crm\/activities\/[^/]+$/;
const CRM_ENTITY_EDIT_CREATE_RE = /^crm\/[^/]+\/(?:create|edit)(?:\/[^/]+)?$/;
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
	const pathOnly = noHash.replace(STRIP_QUERY_RE, '');

	const clean = pathOnly.replace(TRIM_SLASHES_RE, '');
	if (!clean) return keepOrigin && origin ? origin + '/' : '/';

	if (COMPANY_GROUP_TASK_RE.test(clean)) {
		const path = '/' + clean.replace(LAST_SEGMENT_RE, '/');
		return (keepOrigin && origin ? origin : '') + path + (keepQuery ? query : '');
	}

	if (CRM_ACTIVITIES_RE.test(clean)) {
		const path = '/crm/tasks';
		return (keepOrigin && origin ? origin : '') + path + (keepQuery ? query : '');
	}

	if (CRM_ENTITY_EDIT_CREATE_RE.test(clean)) {
		const path = '/' + clean.replace(/^(crm\/[^/]+)\/.*$/, '$1');
		return (keepOrigin && origin ? origin : '') + path + (keepQuery ? query : '');
	}

	if (CRM_ENTITY_WITH_ID_RE.test(clean)) {
		const path = '/' + clean.replace(/^(crm\/[^/]+)\/[^/]+$/, '$1');
		return (keepOrigin && origin ? origin : '') + path + (keepQuery ? query : '');
	}

	if (TASKS_WITH_ID_RE.test(clean)) {
		const path = '/tasks';
		return (keepOrigin && origin ? origin : '') + path + (keepQuery ? query : '');
	}

	const trimmed = clean.replace(LAST_SEGMENT_RE, '');
	const path = trimmed ? '/' + trimmed : '/';
	return (keepOrigin && origin ? origin : '') + path + (keepQuery ? query : '');
};
