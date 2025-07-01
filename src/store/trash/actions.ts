import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITrashFilter } from '@uspacy/sdk/lib/models/trash-filter';

export const fetchTrashItems = createAsyncThunk(
	'trashReducer/fetchTrashItems',
	async (
		{
			filters,
			signal,
		}: {
			filters: ITrashFilter;
			signal?: AbortSignal;
		},
		thunkAPI,
	) => {
		try {
			switch (filters.entity) {
				case 'tasks': {
					const filtersTask = {
						...(!!filters.page && { page: filters.page }),
						...(!!filters.list && { list: filters.list }),
						...(!!filters.owner?.length && { responsibleId: filters.owner }),
						...(!!filters.deleted_by?.length && { deleted_by: filters.deleted_by }),
						...(!!filters.deleted_at?.length && { deleted_at: filters.deleted_at }),
						...(!!filters.created_at?.length && { created_at: filters.created_at }),
						...(!!filters.q && { q: filters.q }),
						boolean_operator: 'XOR',
					};
					const res = await uspacySdk.tasksService.getTrashTasks(filtersTask, signal);
					return res?.data;
				}
				case 'activity': {
					const filtersActivity = {
						...(!!filters.page && { page: filters.page }),
						...(!!filters.list && { list: filters.list }),
						...(!!filters.owner?.length && { responsible_Id: filters.owner }),
						...(!!filters.deleted_by?.length && { changed_by: filters.deleted_by }),
						...(!!filters.deleted_at?.length && { deleted_at: filters.deleted_at }),
						...(!!filters.created_at?.length && { created_at: filters.created_at }),
						...(!!filters.q && { q: filters.q }),
						boolean_operator: 'AND',
					};
					const res = await uspacySdk.crmTasksService.getTrashActivities(filtersActivity, signal);
					return res?.data;
				}
				default: {
					const filtersActivity = {
						...(!!filters.page && { page: filters.page }),
						...(!!filters.list && { list: filters.list }),
						...(!!filters.owner?.length && { responsible_Id: filters.owner }),
						...(!!filters.deleted_by?.length && { changed_by: filters.deleted_by }),
						...(!!filters.deleted_at?.length && { deleted_at: filters.deleted_at }),
						...(!!filters.created_at?.length && { created_at: filters.created_at }),
						...(!!filters.q && { q: filters.q }),
						boolean_operator: 'AND',
					};
					const res = await uspacySdk.crmTasksService.getTrashActivities(filtersActivity, signal);
					return res?.data;
				}
			}
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
