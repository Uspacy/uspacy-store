import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';

export const normalizeEntities = (dataArray: IEntityData[], code: string): IEntityData[] => {
	return dataArray.map((data) => {
		let normalized = null;

		switch (code) {
			case 'activities':
				normalized = {
					id: data.id,
					title: data.title || '',
					deleted_by: data.changed_by || null,
					owner: data.responsible_id || null,
					deleted_at: data.deleted_at || null,
					created_at: data.created_at || null,
				};
				break;

			case 'tasks':
				normalized = {
					id: +data.id,
					title: data.title || '',
					deleted_by: +data.changedBy || null,
					owner: +data.responsibleId || null,
					deleted_at: +data.deletedAt || null,
					created_at: +data.createdAt || null,
				};
				break;

			default:
				normalized = {
					id: data.id,
					title: data.title || '',
					deleted_by: data.changed_by || null,
					owner: data.owner || null,
					deleted_at: data.deleted_at || null,
					created_by: data.created_by || null,
				};
				break;
		}

		return normalized;
	});
};
