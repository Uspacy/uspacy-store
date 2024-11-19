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

const mock3 = {
	id: 1,
	title: 'toster charts',
	chart_type: 'column',
	description: 'amazing chart',
	entity_table_name: 'leads',
	logical_operator: 'AND',
	created_at: 1731851087,
	owner_id: 1,
	filter: {
		main: [
			{ field_code: 'created_at', value: { namePeriods: ['certainDateOrPeriod'], certainPeriod: [1704060000, 1735682399] } },
			{ field_code: 'kanban_stage_id', value: [1] },
		],
		group_by: 'owner',
		view_by: { timeframe: 'day', value: 'source' },
		measure_for: 'count',
		additional: { is_view_percent: true, is_view_value: true },
	},
	panel_ids: [],
};

const mock1 = {
	id: 2,
	title: 'toster 123123',
	chart_type: 'column',
	description: '',
	entity_table_name: 'leads',
	logical_operator: 'AND',
	filter: {
		main: [
			{ field_code: 'created_at', value: { namePeriods: ['certainDateOrPeriod'], certainPeriod: [1704060000, 1735682399] } },
			{ field_code: 'kanban_stage_id', value: [1] },
			{ field_code: 'list_single', value: ['test_1'] },
			{ field_code: 'money_multiple', value: { from: 1, to: 1000, currency: 'EUR' } },
		],
		group_by: 'owner',
		view_by: { timeframe: 'day', value: 'source' },
		measure_for: 'count',
		additional: { is_view_percent: true, is_view_value: true },
	},
	panel_ids: [],
	created_at: 1731851087,
	owner_id: 1,
};

const mock2 = {
	id: 3,
	title: 'toster 123123',
	chart_type: 'column',
	description:
		'<p class="PlaygroundEditorTheme__paragraph" dir="ltr"><span style="white-space: pre-wrap;">super </span><b><strong class="PlaygroundEditorTheme__textBold" style="white-space: pre-wrap;">tost s</strong></b></p>',
	entity_table_name: 'leads',
	logical_operator: 'OR',
	filter: {
		main: [
			{ field_code: 'created_at', value: { namePeriods: ['certainDateOrPeriod'], certainPeriod: [1704060000, 1735682399] } },
			{ field_code: 'kanban_stage_id', value: [1] },
			{ field_code: 'list_single', value: ['test_1'] },
			{ field_code: 'money_multiple', value: { from: 1, to: 1000, currency: 'EUR' } },
			{ field_code: 'string_single', value: ['toster1'] },
			{ field_code: 'string_multiple', value: ['toster'] },
			{ field_code: 'textarea_single', value: null },
			{ field_code: 'textarea_multiple', value: null },
			{ field_code: 'int_single', value: { from: '10', to: '1000' } },
			{ field_code: 'int_multiple', value: { from: '10', to: '10000' } },
			{ field_code: 'float_single', value: { from: '12', to: '123' } },
			{ field_code: 'float_multiple', value: { from: '213', to: '1231' } },
			{ field_code: 'money_single', value: { from: '10', to: '10000', currency: 'USD' } },
			{ field_code: 'date_single', value: { namePeriods: ['thisYear', 'thisMonth'], certainPeriod: [] } },
			{ field_code: 'date_multiple', value: { namePeriods: ['thisMonth', 'prevMonth'], certainPeriod: [] } },
			{ field_code: 'label_single', value: ['test_1', 'test_4'] },
			{ field_code: 'label_multiple', value: ['test_2', 'test5', 'test6'] },
			{ field_code: 'list_multiple', value: ['test1', 'test2'] },
			{ field_code: 'phone_single', value: ['12asd'] },
			{ field_code: 'phone_multiple', value: ['38096123123123'] },
			{ field_code: 'email_single', value: ['toster1234'] },
			{ field_code: 'email_multiple', value: ['test@gmail.com'] },
			{ field_code: 'social_single', value: ['test'] },
			{ field_code: 'social_multiple', value: ['toster'] },
			{ field_code: 'link_single', value: ['test'] },
			{ field_code: 'link_multiple', value: ['testst'] },
			{ field_code: 'address_single', value: ['test'] },
			{ field_code: 'address_multiple', value: ['test'] },
			{ field_code: 'boolean_single', value: [true] },
			{ field_code: 'user_single', value: [16, 14, 1] },
			{ field_code: 'user_multiple', value: [1, 16] },
			{ field_code: 'entity_reference_single', value: ['test'] },
			{ field_code: 'entity_reference_multiple', value: ['test'] },
		],
		group_by: 'owner',
		view_by: { timeframe: 'day', value: 'source' },
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
			state.reports = { ...state.reports, data: [...state.reports.data, ...action.payload.data], meta: state.reports.meta };
		},
		[getAnalyticsReportList.pending.type]: (state) => {
			state.loadingReports = true;
			state.errorLoadingReports = null;
		},
		[getAnalyticsReportList.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReports = false;
			state.errorLoadingReports = null;
			state.reports.data = [mock, mock1, mock2, mock3];
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

export const { clearAllReport } = analyticsReducer.actions;

export default analyticsReducer.reducer;
