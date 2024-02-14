import { uspacySdk } from '@uspacy/sdk';
import { INotificationMessage, NotificationAction } from '@uspacy/sdk/lib/models/notifications';
import { IUser } from '@uspacy/sdk/lib/models/user';
import { INotification } from 'src/store/notifications/types';

export const getServiceName = (serviceName: string) => {
	const [service] = serviceName.split('-');
	return service.replace('news_feed', 'newsfeed');
};

export const getLinkEntity = (message: INotificationMessage): string | undefined => {
	if (message.data.action === NotificationAction.DELETE) return undefined;
	const service = getServiceName(message.data.service);
	switch (service) {
		case 'crm':
			return `/crm/${message.data.entity?.table_name || `${message.type === 'task' ? 'tasks/task' : message.type}`}/${message.data.entity.id}`;
		case 'comments':
			if (!message.data.entity?.entity_type) return undefined;
			const linkData = message.data.entity.parent || message.data.entity;
			const isTasksLink = !!message.data.entity?.parent;
			const oneLevelComment = message.data.entity?.parent?.data;
			const twoLevelComment = message.data.entity?.parent?.parent?.data;
			const tasksEntityBase = !!oneLevelComment ? oneLevelComment.entity : twoLevelComment.entity;
			const entityType = isTasksLink ? `${tasksEntityBase.table_name}s` : `${linkData.type}s`;

			const prefix = ['lead', 'deal', 'company', 'contact'].includes(linkData?.entity_type) ? '/crm' : '';
			const entityBase = linkData.entity_type === 'company' ? 'companies' : linkData.entity_type === 'post' ? 'newsfeed' : entityType;
			return `${prefix}/${entityBase}/${isTasksLink ? tasksEntityBase.id : linkData.entity_id}`;
		default: {
			return `/${service}/${message.data.entity.id}`;
		}
	}
};

export const getNotificationTitle = (message: INotificationMessage): string | undefined => {
	const service = getServiceName(message.data.service);
	const mentioned = !!message.data.entity?.mentioned?.users?.[0];
	const parentEntityType = message.data.entity?.parent?.entity_type || message.data.entity?.parent?.type;
	const entityType = message.data.entity?.parent ? parentEntityType : message.data.entity?.entity_type;
	if (message.data.entity?.new_kanban_stage_id && message.data.entity?.old_kanban_stage_id) {
		return `notifications.${service}.${message.data.entity?.table_name || message.type}.${NotificationAction.UPDATE_STAGE}`;
	}
	if (mentioned) return `notifications.${service}.${entityType}.${message.type}.mentioned`;
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

export const getNotificationCommentEntitytitle = (message: INotificationMessage): string | undefined => {
	const oneLevelComment = message.data.entity?.parent?.data;
	const twoLevelComment = message.data.entity?.parent?.parent?.data;

	return !!oneLevelComment ? oneLevelComment?.entity?.title : twoLevelComment?.entity?.title;
};

export const transformNotificationMessage = (message: INotificationMessage, users: IUser[]): INotification => {
	const user = users.find(({ id }) => id === message.data.user_id);
	const timestamp = new Date(message.data.timestamp).getTime();
	const mentioned = !!message.data.entity?.mentioned?.users?.[0];
	const commentEntityTitle = getNotificationCommentEntitytitle(message);
	return {
		id: message.id,
		title: getNotificationTitle(message),
		subTitle: getNotificationSubTitle(message),
		date: timestamp,
		link: getLinkEntity(message),
		author: user,
		mentioned: mentioned,
		commentEntityTitle,
	};
};

export const getRead = async (): Promise<string[]> => {
	try {
		return (await uspacySdk.notificationsService.storageService.table.getItem<string[]>('read')) || [];
	} catch (_) {
		return [];
	}
};

export const setRead = async (ids: string[]) => {
	const read = (await getRead()).filter((id) => !ids.includes(id));
	return uspacySdk.notificationsService.storageService.table.setItem('read', [...read, ...ids]);
};
