import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IAnalyticReport, IAnalyticReportFilter } from '@uspacy/sdk/lib/models/analytics';

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
