import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ICouchItemData } from '@uspacy/sdk/lib/models/couchdb';
import { IFilterPreset } from '@uspacy/sdk/lib/models/filter-preset';
import { IFilterTasks } from '@uspacy/sdk/lib/models/tasks';

export const getFiltersPresets = createAsyncThunk('tasksFilters/getFiltersPresets', async (type: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getFiltersPresets(type);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getFiltersPreset = createAsyncThunk('tasksFilters/getFiltersPreset', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.tasksService.getFiltersPreset(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createFilterPreset = createAsyncThunk(
	'tasksFilters/createFilterPreset',
	async (body: ICouchItemData<IFilterPreset<IFilterTasks>>, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.createFilterPreset(body);
			return { _id: res.data.id, _rev: res.data.rev, ...body };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const updateFilterPreset = createAsyncThunk(
	'tasksFilters/updateFilterPreset',
	async ({ id, rev, body }: { id: string; rev: string; body: ICouchItemData<IFilterPreset<IFilterTasks>> }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.updateFilterPreset(id, rev, body);
			return { _id: res.data.id, _rev: res.data.rev, ...body };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const bulkUpdateFiltersPresets = createAsyncThunk(
	'tasksFilters/bulkUpdateFiltersPresets',
	async (body: ICouchItemData<IFilterPreset<IFilterTasks>>[], { rejectWithValue }) => {
		try {
			const res = await uspacySdk.tasksService.bulkUpdateFiltersPresets(body);
			return { res: res?.data, body };
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteFilterPreset = createAsyncThunk(
	'tasksFilters/deleteFilterPreset',
	async ({ id, rev }: { id: string; rev: string }, { rejectWithValue }) => {
		try {
			await uspacySdk.tasksService.deleteFilterPreset(id, rev);
			return id;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
