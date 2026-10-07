import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IAnalyticReport, IAnalyticReportFilter, IDashboard, IGoal, IGoalFilter } from '@uspacy/sdk/lib/models/analytics';

export const getAnalyticsReportList = createAsyncThunk(
	'analytics/getAnalyticsReportList',
	async (
		data: {
			params: IAnalyticReportFilter;
			signal: AbortSignal;
		},
		{ rejectWithValue },
	) => {
		try {
			const res = await uspacySdk.analyticsService.getAnalyticsReportList(data.params, data?.signal);
			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return rejectWithValue(e);
			}
		}
	},
);

export const getReport = createAsyncThunk('analytics/getReport', async ({ id }: { id: string }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.analyticsService.getAnalyticReport(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createReport = createAsyncThunk('analytics/createReport', async (data: IAnalyticReport, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.analyticsService.createReport(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateReport = createAsyncThunk(
	'analytics/updateReport',
	async ({ id, body }: { id: string; body: IAnalyticReport }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.analyticsService.updateReport(id, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteReport = createAsyncThunk('analytics/deleteReport', async (id: string, { rejectWithValue }) => {
	try {
		await uspacySdk.analyticsService.deleteReport(id);

		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getGoalsList = createAsyncThunk(
	'analytics/getGoalsList',
	async (
		data: {
			params: IGoalFilter;
			signal: AbortSignal;
		},
		{ rejectWithValue },
	) => {
		try {
			const res = await uspacySdk.analyticsService.getGoalsList(data.params, data?.signal);
			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return rejectWithValue(e);
			}
		}
	},
);

export const getGoal = createAsyncThunk('analytics/getGoal', async ({ id }: { id: string }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.analyticsService.getGoal(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createGoal = createAsyncThunk('analytics/createGoal', async (data: Partial<IGoal>, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.analyticsService.createGoal(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateGoal = createAsyncThunk(
	'analytics/updateGoal',
	async ({ id, body }: { id: string; body: Partial<IGoal> }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.analyticsService.updateGoal(id, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteGoal = createAsyncThunk('analytics/deleteGoal', async (id: string, { rejectWithValue }) => {
	try {
		await uspacySdk.analyticsService.deleteGoal(id);
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getDashboardsList = createAsyncThunk('analytics/getDashboards', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.analyticsService.getDashboardsLists();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getDashboard = createAsyncThunk('analytics/getDashboard', async ({ id }: { id: string }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.analyticsService.getDashboard(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createDashboard = createAsyncThunk('analytics/createDashboard', async (data: Partial<IDashboard>, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.analyticsService.createDashboard(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateDashboard = createAsyncThunk(
	'analytics/updateDashboard',
	async ({ id, body }: { id: string; body: IDashboard }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.analyticsService.updateDashboard(id, body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteDashboard = createAsyncThunk('analytics/deleteDashboard', async (id: string, { rejectWithValue }) => {
	try {
		await uspacySdk.analyticsService.deleteDashboard(id);
		return id;
	} catch (e) {
		return rejectWithValue(e);
	}
});
