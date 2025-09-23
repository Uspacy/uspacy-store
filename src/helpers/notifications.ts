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

export const getLinkEntity = (message: INotificationMessage): string | undefined => {
	if (message.data.action === NotificationAction.DELETE) return undefined;
	const service = getServiceName(message.data.service);
	switch (service) {
		case 'crm':
			return `/crm/${message.data.entity?.table_name || `${message.type === 'crm_activity' ? 'tasks/task' : message.type}`}/${
				message.data.entity.id
			}`;
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
			return `/${serviceName}/${message.data.entity.id}`;
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

export const deleteHtmlFromComment = (text: string) => {
	const div = document.createElement('div');
	div.innerHTML = text;
	return div.textContent || div.innerText || '';
};

export const getNotificationSubTitle = (message: INotificationMessage): string | undefined => {
	const service = getServiceName(message.data.service);
	switch (service) {
		case 'comments':
			return deleteHtmlFromComment(message.data.entity.message);
		default: {
			return message.data.entity.title;
		}
	}
};

export const transformNotificationMessage = (message: INotificationMessage, users: IUser[], profileId: number): INotification => {
	const user = users.find(({ id }) => id === message.data.user_id);
	const timestamp = new Date(message.data.timestamp).getTime();
	const mentioned = !!message.data.entity?.mentioned?.users?.includes(profileId);
	const commentEntityTitle = message.data?.root_parent?.data?.title;
	return {
		id: message.id,
		title: getNotificationTitle(message, profileId),
		subTitle: getNotificationSubTitle(message),
		date: timestamp,
		link: getLinkEntity(message),
		author: user,
		mentioned,
		commentEntityTitle,
		read: message.read || false,
		createdAt: message.createdAt,
	};
};
