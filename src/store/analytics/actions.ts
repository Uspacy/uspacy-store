/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IAnalyticReport } from '@uspacy/sdk/lib/models/analytics';

export const getAnalyticsReportList = createAsyncThunk(
	'analytics/getAnalyticsReportList',
	async (
		data: {
			params: any;
			signal: AbortSignal;
		},
		thunkAPI,
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
				return thunkAPI.rejectWithValue('Failure');
			}
		}
	},
);

export const createReport = createAsyncThunk('analytics/createReport', async (data: IAnalyticReport, thunkAPI) => {
	try {
		const res = await uspacySdk.analyticsService.createReport(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateReport = createAsyncThunk('analytics/updateReport', async ({ id, body }: { id: number; body: IAnalyticReport }, thunkAPI) => {
	try {
		const res = await uspacySdk.analyticsService.updateReport(id, body);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteReport = createAsyncThunk('analytics/deleteReport', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.analyticsService.deleteReport(id);

		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
