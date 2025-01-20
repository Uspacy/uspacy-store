import { IAfterGoogleOauthResponse } from '@uspacy/sdk/lib/models/calendars';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import {
	IBill,
	ICoupon,
	IDiscountCoupon,
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

	// ! NEW BILLING
	tariffs: ITariff[];
	portalSubsctription: IPortalSubscription;
	bill: IBill;
	discountCoupon: IDiscountCoupon;
	loadingTariffs: boolean;
	loadingPortalSubsctription: boolean;
	loadingCreatingSubscription: boolean;
	loadingActivatingDemo: boolean;
	loadingDisablingRenewal: boolean;
	loadingDowngradeTariff: boolean;
	loadingDiscountCoupon: boolean;
	errorLoadingTariffs: IErrorsAxiosResponse;
	errorLoadingPortalSubsctription: IErrorsAxiosResponse;
	errorLoadingCreatingSubscription: IErrorsAxiosResponse;
	errorLoadingActivatingDemo: IErrorsAxiosResponse;
	errorLoadingDisablingRenewal: IErrorsAxiosResponse;
	errorLoadingDowngradeTariff: IErrorsAxiosResponse;
	errorLoadingDiscountCoupon: IErrorsAxiosResponse;
}
