import { IAnalyticReport, IAnalyticReportList } from '@uspacy/sdk/lib/models/analytics';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

export interface IState {
	reports: IAnalyticReportList;
	report: IAnalyticReport;
	loadingReports: boolean;
	loadingReport: boolean;
	errorLoadingReports: IErrorsAxiosResponse;
}
