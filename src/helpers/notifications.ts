import { INotificationMessage, NotificationAction } from '@uspacy/sdk/lib/models/notifications';
import { IUser } from '@uspacy/sdk/lib/models/user';
import { ILinkData, INotification } from 'src/store/notifications/types';

import { AVAILABLE_ENTITY_TYPES } from '../const';

export const getServiceName = (serviceName: string) => {
	const [service] = serviceName.split('-');
	return service.replace('news_feed', 'newsfeed');
};

const getEntityBase = (linkData: ILinkData) => {
	if (linkData.type === 'post') return 'newsfeed';

	switch (linkData.entity_type) {
		case 'company':
			return 'companies';
		case 'post':
			return 'newsfeed';
		default:
			if (linkData.type === 'entity_crm') return `${linkData.service}/${linkData.table_name}`;
			return linkData.type ? `${linkData.type}s` : `${linkData.entity_type}s`;
	}
};

const isAutomationMessage = (message: INotificationMessage) => ['automations', 'processes'].includes(message?.data?.service);

const getAutomationKind = (entityType: string) => (['workflows', 'process'].includes(entityType) ? 'process' : 'automation');

const parseAutomationKey = (message: INotificationMessage, value?: string) => {
	if (!isAutomationMessage(message) || !value?.startsWith('notifications.automations.')) return undefined;
	const separatorIndex = value.indexOf('|');
	if (separatorIndex === -1) return { key: value, value: '' };
	return { key: value.slice(0, separatorIndex), value: value.slice(separatorIndex + 1) };
};

export const getLinkEntity = (message: INotificationMessage): string | undefined => {
	if (isAutomationMessage(message)) {
		return getAutomationKind(message.data.entity?.entity_type) === 'process' ? '/automations/workflows' : '/automations/workers';
	}
	if (message.data.action === NotificationAction.DELETE) return undefined;
	if (message.data.service === 'u-approval') {
		const entityId = message?.data?.entity?.entity_id || message?.data?.entity?.id;
		const entityType = message?.data?.entity?.entity_type;
		return `/u-approval/${entityType}/${entityId}`;
	}
	const service = getServiceName(message.data.service);
	const itemId = message?.data?.entity?.id || message?.data?.entity?.entity_id;
	if (message.topic === 'custom' && (message.data.service === 'custom' || !itemId)) return '';
	switch (service) {
		case 'crm':
			return `/crm/${message.data.entity?.table_name || `${message.type === 'crm_activity' ? 'tasks/task' : message.type}`}/${itemId}`;
		case 'comments':
			if (!message.data.entity?.entity_type) return undefined;
			const isWithParent = message.data.root_parent && Object.keys(message.data.root_parent).length;
			const isWithEntityParent = message.data.entity.parent;
			const entityParentLink = isWithEntityParent ? message.data.entity.parent : message.data.entity;
			const linkData = isWithParent ? message.data.root_parent : entityParentLink;
			const tasksEmptyFilters = 'tasksView=list&page=1&perPage=20&boolean_operator=XOR';

			const prefix = ['lead', 'deal', 'company', 'contact'].includes(linkData?.entity_type) ? '/crm' : '';
			const entityBase = getEntityBase(linkData);

			if (message.data.root_parent?.service === 'tasks') {
				return `${prefix}/${entityBase}/${message.data?.root_parent?.data?.id}?${tasksEmptyFilters}&comment_id=${message.data?.entity?.id}`;
			}

			if (message.data.root_parent?.service === 'news_feed') {
				return `${prefix}/${entityBase}/${message.data?.root_parent?.data?.id}?comment_id=${message.data?.entity?.id}`;
			}

			return `${prefix}/${entityBase}/${isWithParent ? linkData.data?.id : linkData.entity_id}`;
		default: {
			const serviceName = service === 'activities' ? 'crm/tasks' : service;
			return `/${serviceName}/${itemId}`;
		}
	}
};

export const getDrawersInfo = (message: INotificationMessage) => {
	if (message.data.service === 'u-approval') return undefined;
	if (message.topic === 'custom' && (message.data.service === 'custom' || !(message?.data?.entity?.id || message?.data?.entity?.entity_id)))
		return undefined;
	if (message.data.action === NotificationAction.DELETE && message?.type !== 'comment') return undefined;
	const service = getServiceName(message.data.service);
	switch (service) {
		case 'activities': {
			return {
				entityCode: 'activities',
				service: 'crm',
				entityId: +message.data.entity.id,
				title: message?.data?.entity?.title,
				commentId: null,
			};
		}
		case 'tasks': {
			return {
				entityCode: 'task',
				service: 'task',
				entityId: +message.data.entity.id,
				title: message?.data?.entity?.title,
				commentId: null,
			};
		}
		case 'crm':
			return {
				entityCode: message.data.entity?.table_name || `${message.type === 'crm_activity' ? 'activities' : message.type}`,
				service: 'crm',
				entityId: +message.data.entity.id,
				title: message?.data?.entity?.title,
				commentId: null,
			};
		case 'comments':
			if (!message.data.entity?.entity_type) return undefined;
			const isWithParent = message.data.root_parent && Object.keys(message.data.root_parent).length;
			const isWithEntityParent = message.data.entity.parent;
			const entityParentLink = isWithEntityParent ? message.data.entity.parent : message.data.entity;
			const linkData = isWithParent ? message.data.root_parent : entityParentLink;
			const entityBase = getEntityBase(linkData);

			if (message.data.root_parent?.service === 'tasks') {
				return {
					entityCode: 'task',
					service: 'task',
					entityId: +message.data?.root_parent?.data?.id,
					commentId: message.data?.entity?.id,
					title: message?.data?.entity?.title,
				};
			}

			if (['activities', 'crm'].includes(message.data.root_parent?.service)) {
				{
					return {
						entityCode: message.data.root_parent?.table_name,
						service: 'crm',
						entityId: +message.data?.root_parent?.data?.id,
						commentId: message.data?.entity?.id,
						title: message?.data?.entity?.title,
					};
				}
			}

			if (message.data.root_parent?.service === 'news_feed') {
				return {
					entityCode: entityBase,
					service: '',
					entityId: +message.data?.root_parent?.data?.id,
					commentId: message.data?.entity?.id,
					title: message?.data?.entity?.title,
				};
			}

			return {
				entityCode: entityBase,
				service: '',
				entityId: null,
				commentId: null,
			};

		default: {
			return {
				entityCode: service,
				service: '',
				entityId: null,
				commentId: null,
			};
		}
	}
};

const checkIfSmartObject = (type: string) => {
	return !AVAILABLE_ENTITY_TYPES.includes(type) ? 'crm.activity' : type;
};

const getEntityType = (message: INotificationMessage) => {
	const rootParentEntityType = message.data?.root_parent?.type;
	const parentEntityType = message.data?.entity?.parent?.entity_type;
	if (rootParentEntityType === 'entity_crm') return message.data?.entity.entity_type;
	if (message.data.root_parent && Object.keys(message.data.root_parent).length) return rootParentEntityType;
	if (parentEntityType) return parentEntityType;
	return checkIfSmartObject(message.data.entity?.entity_type);
};

export const getNotificationTitle = (message: INotificationMessage, profileId: number): string | undefined => {
	const automationTitle = parseAutomationKey(message, message?.data?.entity?.title);
	if (automationTitle) return automationTitle.key;
	if (message.topic === 'custom') {
		return message?.data?.entity?.title;
	}
	const crmBaseTypes = ['leads', 'contacts', 'companies', 'deals'];
	const service = getServiceName(message.data.service);
	const mentioned = !!message.data.entity?.mentioned?.users?.includes(profileId);
	const isSmartObject =
		(message?.data?.root_parent?.service === 'crm' && !crmBaseTypes.includes(message?.data?.root_parent?.table_name.toLowerCase())) ||
		(message?.data?.service === 'crm' && !crmBaseTypes.includes(message?.data?.entity?.table_name.toLowerCase()));
	const entityType = isSmartObject ? 'smart_objects' : getEntityType(message);
	const baseType = isSmartObject ? entityType : message.data.entity?.table_name || message.type;

	if (message.data.entity?.new_kanban_stage_id && message.data.entity?.old_kanban_stage_id) {
		return `notifications.${isSmartObject ? entityType : service}.${baseType}.${NotificationAction.UPDATE_STAGE}`;
	}
	if (mentioned) return `notifications.${service}.${entityType}.${message.type}.mentioned.${message.data.action}`;
	if (service === 'comments') return `notifications.${service}.${entityType}.${message.type}.${message.data.action}`;

	return `notifications.${isSmartObject ? entityType : service}.${baseType}.${message.data.action}`;
};

const MENTION_ALL_TOKEN = '{@(all)[mentionAllMembers]}';
const MENTION_ALL_HTML_REGEX = /<[^<>]*data-mention-type="all"[^<>]*>[^<]*<\/[^<>]+>/g;
const MENTION_ALL_TOKEN_REGEX = /{@\(all\)\[[^\]]+\]}/g;
const HTML_TAG_REGEX = /<[^<>]*>/g;
const HTML_ENTITY_REGEX = /&(#\d+|#x[\da-f]+|[a-z]+);/gi;
const NAMED_HTML_ENTITY_CODES: Record<string, number> = { amp: 38, lt: 60, gt: 62, quot: 34, apos: 39, nbsp: 32 };

const decodeHtmlEntities = (text: string) =>
	text.replace(HTML_ENTITY_REGEX, (entity, code: string) => {
		if (code.startsWith('#')) {
			const codePoint = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
			return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint);
		}
		const namedCodePoint = NAMED_HTML_ENTITY_CODES[code.toLowerCase()];
		return namedCodePoint ? String.fromCodePoint(namedCodePoint) : entity;
	});

export const deleteHtmlFromComment = (text: string) =>
	decodeHtmlEntities((text || '').replace(MENTION_ALL_HTML_REGEX, MENTION_ALL_TOKEN).replace(HTML_TAG_REGEX, ''));

const translateMentionAllToken = (text: string, label?: string) => (label ? (text || '').replace(MENTION_ALL_TOKEN_REGEX, label) : text);

export const getNotificationSubTitle = (message: INotificationMessage): string | undefined => {
	const automationSource = parseAutomationKey(message, message?.data?.entity?.description);
	if (automationSource) return automationSource.key;
	if (isAutomationMessage(message)) return '';
	if (message.topic === 'custom') {
		return message?.data?.entity?.description;
	}
	const service = getServiceName(message.data.service);
	switch (service) {
		case 'comments':
			return deleteHtmlFromComment(message.data.entity.message);
		default: {
			return message.data.entity.title;
		}
	}
};

export interface INotificationViewOptions {
	recipientId: number;
	users?: IUser[];
	translate?: (key: string, params?: Record<string, string>) => string;
	mentionAllLabel?: string;
}

export interface INotificationView {
	titleKey: string;
	titleParams?: Record<string, string>;
	subTitleKey: string;
	subTitleParams?: Record<string, string>;
	title: string;
	body: string;
	url?: string;
	drawer: ReturnType<typeof getDrawersInfo>;
	author?: IUser;
	mentioned: boolean;
	date: number;
	commentEntityTitle?: string;
}

export const getNotificationView = (
	message: INotificationMessage,
	{ recipientId, users = [], translate, mentionAllLabel }: INotificationViewOptions,
): INotificationView => {
	const titleKey = getNotificationTitle(message, recipientId);
	const subTitleKey = getNotificationSubTitle(message);
	const user = users.find(({ id }) => id === message.data.user_id);
	const automationTitle = parseAutomationKey(message, message.data?.entity?.title);
	const automationSource = parseAutomationKey(message, message.data?.entity?.description);
	const titleParams = automationTitle ? { title: automationTitle.value } : undefined;
	const subTitleParams = automationSource ? { user: user ? `${user.firstName} ${user.lastName}` : `#${message.data.user_id}` } : undefined;
	const translateKey = translate || ((key: string) => key);
	return {
		titleKey,
		titleParams,
		subTitleKey,
		subTitleParams,
		title: titleKey ? translateKey(titleKey, titleParams) : '',
		body: subTitleParams ? translateKey(subTitleKey, subTitleParams) : translateMentionAllToken(subTitleKey, mentionAllLabel),
		url: getLinkEntity(message),
		drawer: getDrawersInfo(message),
		author: user,
		mentioned: !!message.data.entity?.mentioned?.users?.includes(recipientId),
		date: new Date(message.data.timestamp).getTime(),
		commentEntityTitle: message.data?.root_parent?.data?.title,
	};
};

export const transformNotificationMessage = (message: INotificationMessage, users: IUser[], profileId: number): INotification => {
	const view = getNotificationView(message, { recipientId: profileId, users });
	return {
		id: message.id,
		title: view.titleKey,
		subTitle: view.subTitleKey,
		date: view.date,
		link: view.url,
		author: view.author,
		drawerInfo: view.drawer,
		mentioned: view.mentioned,
		commentEntityTitle: view.commentEntityTitle,
		read: message.read || false,
		createdAt: message.createdAt,
		metadata: message?.metadata ?? [],
		...(view.titleParams && { titleParams: view.titleParams }),
		...(view.subTitleParams && { subTitleParams: view.subTitleParams }),
	};
};
