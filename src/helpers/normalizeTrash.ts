import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';

export const normalizeEntities = (dataArray: IEntityData[], code: string): IEntityData[] => {
	return dataArray.map((data) => {
		let normalized = null;

		switch (code) {
			case 'activities':
				normalized = {
					id: data.id,
					id_column: data.id,
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
					id_column: data.id,
					title: data.title || '',
					deleted_by: +data.changedBy || null,
					owner: +data.responsibleId || null,
					deleted_at: +data.deletedAt || null,
					created_at: +data.createdDate || null,
				};
				break;

			default:
				normalized = {
					id: data.id,
					id_column: data.id,
					title: data.title || '',
					deleted_by: data.changed_by || null,
					owner: data.owner || null,
					deleted_at: data.deleted_at || null,
					created_at: data.created_at || null,
				};
				break;
		}

		return normalized;
	});
};
