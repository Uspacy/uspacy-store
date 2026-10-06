const ORIGIN_RE = /^[a-z]+:\/\/[^/]+/i;
const STRIP_QUERY_AND_HASH_RE = /[?#].*$/;
const GROUP_TASKS_RE = /\/company\/groups\/[^/]+\/tasks/;

export const TASKS_ROOT_PATH = '/tasks';
export const TASK_TEMPLATES_SEGMENT = 'templates';
export const TASK_TEMPLATE_TYPES = ['recurring', 'one_time'];

export const isTaskTemplateType = (entityCode?: string): boolean => TASK_TEMPLATE_TYPES.includes(entityCode);

export const getTasksBasePath = (url = ''): string => {
	const path = String(url).replace(ORIGIN_RE, '').replace(STRIP_QUERY_AND_HASH_RE, '');

	return path.match(GROUP_TASKS_RE)?.[0] ?? TASKS_ROOT_PATH;
};

export const buildTasksCardLink = ({
	basePath,
	entityCode,
	entityId,
}: {
	basePath: string;
	entityCode?: string;
	entityId?: string | number;
}): string => {
	const typeSegment = isTaskTemplateType(entityCode) ? `/${TASK_TEMPLATES_SEGMENT}/${entityCode}` : '';

	return `${basePath}${typeSegment}/${entityId || 'create'}`;
};
