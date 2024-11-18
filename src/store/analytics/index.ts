import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAnalyticReport, IAnalyticReportList } from '@uspacy/sdk/lib/models/analytics';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { createReport, deleteReport, getAnalyticsReportList, getReport, updateReport } from './actions';
import { IState } from './types';

const mock: IAnalyticReport = {
	id: 4,
	title: 'toster 123123',
	chart_type: 'column',
	description:
		'<p class="PlaygroundEditorTheme__paragraph" dir="ltr"><span style="white-space: pre-wrap;">super </span><b><strong class="PlaygroundEditorTheme__textBold" style="white-space: pre-wrap;">tost s</strong></b></p>',
	entity_table_name: 'activity',
	logical_operator: 'OR',
	filter: {
		main: [
			{ field_code: 'type', value: ['task', 'call', 'meeting', 'chat'] },
			{ field_code: 'status', value: ['planned', 'done', 'cancelled'] },
			{ field_code: 'priority', value: ['veryHigh', 'neutral', 'notHigh', 'high'] },
			{ field_code: 'description', value: ['test 1234'] },
		],
		group_by: '',
		view_by: { timeframe: 'day', value: 'responsible_id' },
		measure_for: 'count',
		additional: { is_view_percent: true, is_view_value: true },
	},
	panel_ids: [],
	created_at: 1731851087,
	owner_id: 1,
};

const initialState = {
	reports: {
		data: [],
		meta: {
			total: 0,
			page: 1,
		},
	},
	report: mock,
	loadingReports: false,
	loadingReport: false,
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
			state.reports = { ...state.reports, data: [...state.reports.data, ...action.payload.data], meta: state.reports.meta };
		},
		[getAnalyticsReportList.pending.type]: (state) => {
			state.loadingReports = true;
			state.errorLoadingReports = null;
		},
		[getAnalyticsReportList.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReports = false;
			state.errorLoadingReports = action.payload;
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

export default analyticsReducer.reducer;
