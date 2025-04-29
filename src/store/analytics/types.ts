import { IAnalyticReport, IAnalyticReportList, IDashboard } from '@uspacy/sdk/lib/models/analytics';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	dashboards: IDashboard[];
	dashboard: IDashboard;
	reports: IAnalyticReportList;
	report: IAnalyticReport;
	loadingDashboards: boolean;
	loadingDashboard: boolean;
	loadingReports: boolean;
	loadingReport: boolean;
	errorLoadingReports: IErrorsAxiosResponse;
	errorLoadingDashboards: IErrorsAxiosResponse;
}
