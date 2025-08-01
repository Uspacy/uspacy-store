import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ITrashFilter } from '@uspacy/sdk/lib/models/trash-filter';

import { getTrashFilterByEntity } from '../../helpers/getTrashFilterByEntity';

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
			const filtersParams = getTrashFilterByEntity(filters);
			switch (filters.entity) {
				case 'tasks': {
					const res = await uspacySdk.tasksService.getTrashTasks(filtersParams, signal);
					return res?.data;
				}
				case 'activities': {
					const res = await uspacySdk.crmTasksService.getTrashActivities(filtersParams, signal);
					return res?.data;
				}
				default: {
					const res = await uspacySdk.crmEntitiesService.getTrashEntities(filtersParams, filters.entity, signal);
					return res?.data;
				}
			}
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
