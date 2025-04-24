import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAnalyticReport, IAnalyticReportList, IDashboard } from '@uspacy/sdk/lib/models/analytics';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { addReportToLayout, removeReportFromLayout } from '../../helpers/dashboardHelper';
import {
	createDashboard,
	createReport,
	deleteDashboard,
	deleteReport,
	getAnalyticsReportList,
	getDashboard,
	getDashboardsList,
	getReport,
	updateDashboard,
	updateReport,
} from './actions';
import { IState } from './types';

const initialState = {
	reports: {
		data: [],
		meta: {
			total: 0,
			page: 1,
		},
	},
	dashboards: [],
	dashboard: null,
	report: null,
	loadingDashboards: true,
	loadingDashboard: true,
	loadingReports: true,
	loadingReport: true,
	errorLoadingReports: null,
	errorLoadingDashboards: null,
} as IState;

const analyticsReducer = createSlice({
	name: 'analytics',
	initialState,
	reducers: {
		clearAllReport: (state) => {
			state.reports = initialState.reports;
		},
		clearAllDashboard: (state) => {
			state.dashboards = initialState.dashboards;
		},
		updateDashboardStateById: (state, action: PayloadAction<IDashboard>) => {
			state.dashboards = state.dashboards.map((it) => (it.id === action.payload.id ? action.payload : it));
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
				meta: { ...state.reports.meta, total: state.reports.meta.total + 1, unfiltered_total: state.reports.meta.unfiltered_total + 1 },
			};
			state.dashboards = state.dashboards.map((dashboard) => {
				if (action.payload.dashboards.includes(dashboard.id)) {
					return {
						...dashboard,
						layout: addReportToLayout(dashboard.layout, action.payload),
					};
				}
				return dashboard;
			});
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
			state.dashboards = state.dashboards.map((dashboard) => {
				const hasReportInLayout = dashboard.layout.some((item) => item.report_id === action.payload.id);
				const hasReportInDashboard = action.payload.dashboards.includes(dashboard.id);

				if (hasReportInLayout && !hasReportInDashboard) {
					return {
						...dashboard,
						layout: removeReportFromLayout(dashboard.layout, action.payload.id),
					};
				}

				if (!hasReportInLayout && hasReportInDashboard) {
					return {
						...dashboard,
						layout: addReportToLayout(dashboard.layout, action.payload),
					};
				}

				if (hasReportInLayout && hasReportInDashboard) {
					return {
						...dashboard,
						layout: dashboard.layout.map((item) => (item.report_id === action.payload.id ? { ...item, report: action.payload } : item)),
					};
				}

				return dashboard;
			});
		},
		[updateReport.pending.type]: (state) => {
			state.loadingReport = true;
			state.errorLoadingReports = null;
		},
		[updateReport.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReport = false;
			state.errorLoadingReports = action.payload;
		},
		[deleteReport.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loadingReport = false;
			state.errorLoadingReports = null;
			state.report = initialState.report;
			state.reports = {
				...state.reports,
				data: state.reports.data.filter((it) => it.id !== action.payload),
				meta: { ...state.reports.meta, total: state.reports.meta.total - 1, unfiltered_total: state.reports.meta.unfiltered_total - 1 },
			};
			state.dashboards = state.dashboards.map((dashboard) => {
				if (dashboard.layout.some((item) => item.report_id === action.payload)) {
					return {
						...dashboard,
						layout: removeReportFromLayout(dashboard.layout, action.payload),
					};
				}
				return dashboard;
			});
		},
		[deleteReport.pending.type]: (state) => {
			state.loadingReport = true;
			state.errorLoadingReports = null;
		},
		[deleteReport.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingReport = false;
			state.errorLoadingReports = action.payload;
		},

		[getDashboardsList.fulfilled.type]: (state, action: PayloadAction<IDashboard[]>) => {
			state.loadingDashboards = false;
			state.errorLoadingDashboards = null;
			state.dashboards = action.payload || [];
		},
		[getDashboardsList.pending.type]: (state) => {
			state.loadingDashboards = true;
			state.errorLoadingDashboards = null;
		},
		[getDashboardsList.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDashboards = false;
			state.errorLoadingDashboards = action.payload;
		},
		[getDashboard.fulfilled.type]: (state, action: PayloadAction<IAnalyticReport>) => {
			state.loadingDashboard = false;
			state.report = action.payload;
		},
		[getDashboard.pending.type]: (state) => {
			state.loadingDashboard = true;
		},
		[getDashboard.rejected.type]: (state) => {
			state.loadingDashboard = false;
		},
		[createDashboard.fulfilled.type]: (state, action: PayloadAction<IDashboard, string, { arg: IDashboard }>) => {
			const dashboard = { ...action.meta.arg, id: action.payload.id };
			state.dashboard = action.payload;
			state.dashboards = [dashboard, ...state.dashboards];
		},
		[createDashboard.pending.type]: (state) => {
			state.loadingDashboard = true;
		},
		[createDashboard.rejected.type]: (state) => {
			state.loadingDashboard = false;
		},
		[updateDashboard.pending.type]: (state, action: PayloadAction<IDashboard, string, { arg: { id: string; body: IDashboard } }>) => {
			const dashboard = action.meta.arg.body;
			state.dashboard = dashboard;
			state.dashboards = state.dashboards.map((it) => (it.id === dashboard.id ? dashboard : it));
		},
		[deleteDashboard.pending.type]: (state, action: PayloadAction<string, string, { arg: string }>) => {
			state.dashboard = initialState.dashboard;
			state.dashboards = state.dashboards.filter((it) => it.id !== action.meta.arg);
		},
	},
});

export const { clearAllReport, clearAllDashboard, updateDashboardStateById } = analyticsReducer.actions;

export default analyticsReducer.reducer;
