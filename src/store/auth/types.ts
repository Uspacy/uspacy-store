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
	downloadPdfLink: string;
	loadingInvoices: boolean;
	loadingPdfLink: boolean;
	loadingRatesList: boolean;
	loadingSubscription: boolean;
	loadingSubscriptionItem: boolean;
	loadingCoupon: boolean;
	loadingPaymentIntent: boolean;
	loadingSubscriptionRenewal: boolean;
	loadingActivateDemo: boolean;
	errorLoadingInvoices: IErrorsAxiosResponse;
	errorLoadingPdfLink: IErrorsAxiosResponse;
	errorLoadingRatesList: IErrorsAxiosResponse;
	errorloadingSubscription: IErrorsAxiosResponse;
	errorloadingSubscriptionItem: IErrorsAxiosResponse;
	errorLoadingCoupon: IErrorsAxiosResponse;
	errorLoadingPaymentIntent: IErrorsAxiosResponse;
	errorLoadingSubscriptionRenewal: IErrorsAxiosResponse;
	errorActivateDemo: IErrorsAxiosResponse;
}
