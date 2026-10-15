import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAnalyticReport, IAnalyticReportList, IDashboard, IGoal, IGoalList } from '@uspacy/sdk/lib/models/analytics';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { addGoalToLayout, addReportToLayout, removeGoalFromLayout, removeReportFromLayout } from '../../helpers/dashboardHelper';
import {
	createDashboard,
	createGoal,
	createReport,
	deleteDashboard,
	deleteGoal,
	deleteReport,
	getAnalyticsReportList,
	getDashboard,
	getDashboardsList,
	getGoal,
	getGoalsList,
	getReport,
	updateDashboard,
	updateGoal,
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
	goals: {
		data: [],
		meta: {
			total: 0,
			page: 1,
		},
	},
	dashboards: [],
	dashboard: null,
	report: null,
	goal: null,
	loadingDashboards: true,
	loadingDashboard: true,
	loadingReports: true,
	loadingReport: true,
	loadingGoals: true,
	loadingGoal: true,
	errorLoadingReports: null,
	errorLoadingGoals: null,
	errorLoadingDashboards: null,
} as IState;

const analyticsReducer = createSlice({
	name: 'analytics',
	initialState,
	reducers: {
		clearAllReport: (state) => {
			state.reports = initialState.reports;
		},
		clearAllGoals: (state) => {
			state.goals = initialState.goals;
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

		[getGoalsList.fulfilled.type]: (state, action: PayloadAction<IGoalList>) => {
			state.loadingGoals = false;
			state.errorLoadingGoals = null;
			state.goals = { ...state.goals, data: [...state.goals.data, ...action.payload.data], meta: action.payload.meta };
		},
		[getGoalsList.pending.type]: (state) => {
			state.loadingGoals = true;
			state.errorLoadingGoals = null;
		},
		[getGoalsList.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGoals = false;
			state.errorLoadingGoals = action.payload;
		},
		[getGoal.fulfilled.type]: (state, action: PayloadAction<IGoal>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = null;
			state.goal = action.payload;
		},
		[getGoal.pending.type]: (state) => {
			state.loadingGoal = true;
			state.errorLoadingGoals = null;
		},
		[getGoal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = action.payload;
		},
		[createGoal.fulfilled.type]: (state, action: PayloadAction<IGoal>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = null;
			state.goal = action.payload;
			state.goals = {
				...state.goals,
				data: [action.payload, ...state.goals.data],
				meta: { ...state.goals.meta, total: state.goals.meta.total + 1, unfiltered_total: state.goals.meta.unfiltered_total + 1 },
			};
			state.dashboards = state.dashboards.map((dashboard) =>
				action.payload.dashboards?.includes(dashboard.id)
					? { ...dashboard, layout: addGoalToLayout(dashboard.layout, action.payload) }
					: dashboard,
			);
		},
		[createGoal.pending.type]: (state) => {
			state.loadingGoal = true;
			state.errorLoadingGoals = null;
		},
		[createGoal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = action.payload;
		},
		[updateGoal.fulfilled.type]: (state, action: PayloadAction<IGoal>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = null;
			state.goal = action.payload;
			state.goals = { ...state.goals, data: state.goals.data.map((it) => (it.id === action.payload.id ? action.payload : it)) };
			state.dashboards = state.dashboards.map((dashboard) => {
				const hasGoalInLayout = dashboard.layout.some((item) => item.goal_id === action.payload.id);
				const hasGoalInDashboard = action.payload.dashboards?.includes(dashboard.id);

				if (hasGoalInLayout && !hasGoalInDashboard) {
					return { ...dashboard, layout: removeGoalFromLayout(dashboard.layout, action.payload.id) };
				}

				if (!hasGoalInLayout && hasGoalInDashboard) {
					return { ...dashboard, layout: addGoalToLayout(dashboard.layout, action.payload) };
				}

				if (hasGoalInLayout && hasGoalInDashboard) {
					return {
						...dashboard,
						layout: dashboard.layout.map((item) => (item.goal_id === action.payload.id ? { ...item, goal: action.payload } : item)),
					};
				}

				return dashboard;
			});
		},
		[updateGoal.pending.type]: (state) => {
			state.loadingGoal = true;
			state.errorLoadingGoals = null;
		},
		[updateGoal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = action.payload;
		},
		[deleteGoal.fulfilled.type]: (state, action: PayloadAction<string>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = null;
			state.goals = {
				...state.goals,
				data: state.goals.data.filter((it) => it.id !== action.payload),
				meta: { ...state.goals.meta, total: state.goals.meta.total - 1, unfiltered_total: state.goals.meta.unfiltered_total - 1 },
			};
			state.dashboards = state.dashboards.map((dashboard) => ({
				...dashboard,
				layout: removeGoalFromLayout(dashboard.layout, action.payload),
			}));
		},
		[deleteGoal.pending.type]: (state) => {
			state.loadingGoal = true;
			state.errorLoadingGoals = null;
		},
		[deleteGoal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingGoal = false;
			state.errorLoadingGoals = action.payload;
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

export const { clearAllReport, clearAllGoals, clearAllDashboard, updateDashboardStateById } = analyticsReducer.actions;

export default analyticsReducer.reducer;
