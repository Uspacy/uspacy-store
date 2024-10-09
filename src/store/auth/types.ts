import { IAfterGoogleOauthResponse } from '@uspacy/sdk/lib/models/calendars';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ICoupon, IIntent, IInvoiceData, IInvoices, IRatesList, ISubscription } from '@uspacy/sdk/lib/models/tariffs';

export interface IState {
	invoices: IInvoices;
	invoice: IInvoiceData;
	ratesList: IRatesList;
	subscription: ISubscription[];
	activeSubscription?: ISubscription;
	coupon: ICoupon;
	intent: IIntent;
	afterGoogleOAuthData: IAfterGoogleOauthResponse;
	downloadPdfLink: string;
	loadingInvoices: boolean;
	loadingPdfLink: boolean;
	loadingRatesList: boolean;
	loadingSubscription: boolean;
	loadingSubscriptionItem: boolean;
	loadingCoupon: boolean;
	loadingPaymentIntent: boolean;
	loadingUsingPaymentIntent: boolean;
	loadingSubscriptionRenewal: boolean;
	loadingActivateDemo: boolean;
	loadingDowngrade: boolean;
	loadingAfterGoogleOAuth: boolean;
	errorLoadingInvoices: IErrorsAxiosResponse;
	errorLoadingPdfLink: IErrorsAxiosResponse;
	errorLoadingRatesList: IErrorsAxiosResponse;
	errorloadingSubscription: IErrorsAxiosResponse;
	errorloadingSubscriptionItem: IErrorsAxiosResponse;
	errorLoadingCoupon: IErrorsAxiosResponse;
	errorLoadingPaymentIntent: IErrorsAxiosResponse;
	errorLoadingSubscriptionRenewal: IErrorsAxiosResponse;
	errorActivateDemo: IErrorsAxiosResponse;
	errorLoadingDowngrade: IErrorsAxiosResponse;
	errorLoadingUsingPaymentIntent: IErrorsAxiosResponse;
	errorLoadingAfterGoogleOAuth: IErrorsAxiosResponse;
}
