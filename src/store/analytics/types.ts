import { IAnalyticReport, IAnalyticReportList, IDashboard, IGoal, IGoalList } from '@uspacy/sdk/lib/models/analytics';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	dashboards: IDashboard[];
	dashboard: IDashboard;
	reports: IAnalyticReportList;
	report: IAnalyticReport;
	goals: IGoalList;
	goal: IGoal;
	loadingDashboards: boolean;
	loadingDashboard: boolean;
	loadingReports: boolean;
	loadingReport: boolean;
	loadingGoals: boolean;
	loadingGoal: boolean;
	errorLoadingReports: IErrorsAxiosResponse;
	errorLoadingGoals: IErrorsAxiosResponse;
	errorLoadingDashboards: IErrorsAxiosResponse;
}
