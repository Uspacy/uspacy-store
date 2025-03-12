import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IAfterOauthResponse } from '@uspacy/sdk/lib/models/oauthIntegrations';
import {
	IBill,
	ICoupon,
	IIntent,
	IInvoiceData,
	IInvoices,
	IPortalSubscription,
	IRatesList,
	ISubscription,
	ITariff,
} from '@uspacy/sdk/lib/models/tariffs';

export interface IState {
	invoices: IInvoices;
	invoice: IInvoiceData;
	ratesList: IRatesList;
	subscription: ISubscription[];
	activeSubscription?: ISubscription;
	coupon: ICoupon;
	intent: IIntent;
	afterGoogleOAuthData: IAfterOauthResponse;
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

	// ! NEW BILLING
	tariffs: ITariff[];
	portalSubsctription: IPortalSubscription;
	bill: IBill;
	loadingTariffs: boolean;
	loadingPortalSubsctription: boolean;
	loadingCreatingSubscription: boolean;
	loadingActivatingDemo: boolean;
	loadingDisablingRenewal: boolean;
	loadingDowngradeTariff: boolean;
	errorLoadingTariffs: IErrorsAxiosResponse;
	errorLoadingPortalSubsctription: IErrorsAxiosResponse;
	errorLoadingCreatingSubscription: IErrorsAxiosResponse;
	errorLoadingActivatingDemo: IErrorsAxiosResponse;
	errorLoadingDisablingRenewal: IErrorsAxiosResponse;
	errorLoadingDowngradeTariff: IErrorsAxiosResponse;
}
