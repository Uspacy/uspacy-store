import { ITrashFilter } from '@uspacy/sdk/lib/models/trash-filter';
import isArray from 'lodash/isArray';

const getSortByFilter = (sortModel) => {
	const array = isArray(sortModel) ? sortModel : [sortModel];
	if (array.length === 0) return {};
	const [field, sort] = Object?.entries(array[0])[0];
	const checkField = field === 'id_column' ? 'id' : field;
	return { [`sort_by[${checkField}]`]: sort };
};

export const getTrashFilterByEntity = (filters: ITrashFilter, withoutPagination?: boolean) => {
	const mainFilter = {
		...(!!filters.page && !withoutPagination && { page: filters.page }),
		...(!!filters.list && !withoutPagination && { list: filters.list }),
		...(!!filters.q && { q: filters.q }),
		...(!!filters.sortModel?.length && getSortByFilter(filters.sortModel)),
	};
	switch (filters.entity) {
		case 'tasks': {
			const filtersTask = {
				...(!!filters.owner?.length && { responsibleId: filters.owner }),
				...(!!filters.deleted_by?.length && { changedBy: filters.deleted_by }),
				...(!!filters.deleted_at?.length && { deletedAt: filters.deleted_at }),
				...(!!filters.created_at?.length && { created_date: filters.created_at }),
				...mainFilter,
			};
			return filtersTask;
		}
		case 'activities': {
			const filtersActivity = {
				...(!!filters.owner?.length && { responsible_id: filters.owner }),
				...(!!filters.deleted_by?.length && { changed_by: filters.deleted_by }),
				...(!!filters.deleted_at?.length && { deleted_at: filters.deleted_at }),
				...(!!filters.created_at?.length && { created_at: filters.created_at }),
				...mainFilter,
			};
			return filtersActivity;
		}
		default: {
			const defaultFilters = {
				...(!!filters.owner?.length && { owner: filters.owner }),
				...(!!filters.deleted_by?.length && { changed_by: filters.deleted_by }),
				...(!!filters.deleted_at?.length && { deleted_at: filters.deleted_at }),
				...(!!filters.created_at?.length && { created_at: filters.created_at }),
				...mainFilter,
			};
			return defaultFilters;
		}
	}
};
