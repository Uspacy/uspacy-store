import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAnalyticReport, IAnalyticReportList } from '@uspacy/sdk/lib/models/analytics';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { createReport, deleteReport, getAnalyticsReportList, getReport, updateReport } from './actions';
import { IState } from './types';

const initialState = {
	reports: {
		data: [],
		meta: {
			total: 0,
			page: 1,
		},
	},
	report: null,
	loadingReports: true,
	loadingReport: true,
	errorLoadingReports: null,
} as IState;

const analyticsReducer = createSlice({
	name: 'analytics',
	initialState,
	reducers: {
		clearAllReport: (state) => {
			state.reports = initialState.reports;
		},
	},
	extraReducers: {
		[getAnalyticsReportList.fulfilled.type]: (state, action: PayloadAction<IAnalyticReportList>) => {
			state.loadingReports = false;
			state.errorLoadingReports = null;
			state.reports = { ...state.reports, data: [...state.reports.data, ...action.payload.data], meta: action.payload.meta };
		},
		[getAnalyticsReportList.pending.type]: (state) => {
			state.loadingReports = true;
			state.errorLoadingReports = null;
		},
		[getAnalyticsReportList.rejected.type]: (state) => {
			state.loadingReports = false;
			state.errorLoadingReports = null;
		},
		[getReport.fulfilled.type]: (state, action: PayloadAction<IAnalyticReport>) => {
			state.loadingReport = false;
			state.errorLoadingReports = null;
			state.report = action.payload;
		},
		[getReport.pending.type]: (state) => {
			state.loadingReport = true;
			state.errorLoadingReports = null;
		},
		[getReport.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReport = false;
			state.errorLoadingReports = action.payload;
		},
		[createReport.fulfilled.type]: (state, action: PayloadAction<IAnalyticReport>) => {
			state.loadingReport = false;
			state.errorLoadingReports = null;
			state.report = action.payload;
			state.reports = {
				...state.reports,
				data: [action.payload, ...state.reports.data],
				meta: { ...state.reports.meta, total: state.reports.meta.total + 1 },
			};
		},
		[createReport.pending.type]: (state) => {
			state.loadingReport = true;
			state.errorLoadingReports = null;
		},
		[createReport.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReport = false;
			state.errorLoadingReports = action.payload;
		},
		[updateReport.fulfilled.type]: (state, action: PayloadAction<IAnalyticReport>) => {
			state.loadingReport = false;
			state.errorLoadingReports = null;
			state.report = action.payload;
			state.reports = { ...state.reports, data: state.reports.data.map((it) => (it.id === action.payload.id ? action.payload : it)) };
		},
		[updateReport.pending.type]: (state) => {
			state.loadingReport = true;
			state.errorLoadingReports = null;
		},
		[updateReport.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReport = false;
			state.errorLoadingReports = action.payload;
		},
		[deleteReport.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingReport = false;
			state.errorLoadingReports = null;
			state.report = initialState.report;
			state.reports = {
				...state.reports,
				data: state.reports.data.filter((it) => it.id !== action.payload),
				meta: { ...state.reports.meta, total: state.reports.meta.total - 1 },
			};
		},
		[deleteReport.pending.type]: (state) => {
			state.loadingReport = true;
			state.errorLoadingReports = null;
		},
		[deleteReport.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReport = false;
			state.errorLoadingReports = action.payload;
		},
	},
});

export const { clearAllReport } = analyticsReducer.actions;

export default analyticsReducer.reducer;
