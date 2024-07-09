import { INotificationMessage, NotificationAction } from '@uspacy/sdk/lib/models/notifications';
import { IUser } from '@uspacy/sdk/lib/models/user';
import { AVAILABLE_ENTITY_TYPES } from 'src/const';
import { ILinkData, INotification } from 'src/store/notifications/types';

export const getServiceName = (serviceName: string) => {
	const [service] = serviceName.split('-');
	return service.replace('news_feed', 'newsfeed');
};

const getEntityBase = (linkData: ILinkData) => {
	switch (linkData.entity_type) {
		case 'company':
			return 'companies';
		case 'post':
			return 'newsfeed';
		default:
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

			const prefix = ['lead', 'deal', 'company', 'contact'].includes(linkData?.entity_type) ? '/crm' : '';
			const entityBase = getEntityBase(linkData);

			return `${prefix}/${entityBase}/${isWithParent ? linkData.data?.id : linkData.entity_id}`;
		default: {
			return `/${service}/${message.data.entity.id}`;
		}
	}
};

const checkIfSmartObject = (type: string) => {
	return !AVAILABLE_ENTITY_TYPES.includes(type) ? 'crm_activity' : type;
};

const getEntityType = (message: INotificationMessage) => {
	const rootParentEntityType = checkIfSmartObject(message.data?.root_parent?.type);
	const parentEntityType = checkIfSmartObject(message.data?.entity?.parent?.entity_type);
	if (message.data.root_parent && Object.keys(message.data.root_parent).length) return rootParentEntityType;
	if (parentEntityType) return parentEntityType;
	return checkIfSmartObject(message.data.entity?.entity_type);
};

export const getNotificationTitle = (message: INotificationMessage, profileId: number): string | undefined => {
	const service = getServiceName(message.data.service);
	const mentioned = !!message.data.entity?.mentioned?.users?.includes(profileId);
	const entityType = getEntityType(message);
	if (message.data.entity?.new_kanban_stage_id && message.data.entity?.old_kanban_stage_id) {
		return `notifications.${service}.${message.data.entity?.table_name || message.type}.${NotificationAction.UPDATE_STAGE}`;
	}
	if (mentioned) return `notifications.${service}.${entityType}.${message.type}.mentioned.${message.data.action}`;
	if (service === 'comments') return `notifications.${service}.${entityType}.${message.type}.${message.data.action}`;

	return `notifications.${service}.${message.data.entity?.table_name || message.type}.${message.data.action}`;
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
