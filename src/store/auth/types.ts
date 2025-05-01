import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IAfterOauthResponse } from '@uspacy/sdk/lib/models/oauthIntegrations';
import { IBill, IPortalSubscription, ITariff } from '@uspacy/sdk/lib/models/tariffs';

export interface IState {
	afterGoogleOAuthData: IAfterOauthResponse;
	tariffs: ITariff[];
	portalSubsctription: IPortalSubscription;
	bill: IBill;
	redirectToStripeUrl: string;
	loadingAfterGoogleOAuth: boolean;
	loadingTariffs: boolean;
	loadingPortalSubsctription: boolean;
	loadingCreatingSubscription: boolean;
	loadingActivatingDemo: boolean;
	loadingDisablingRenewal: boolean;
	loadingDowngradeTariff: boolean;
	loadingRedirectToStripeUrl: boolean;
	errorLoadingAfterGoogleOAuth: IErrorsAxiosResponse;
	errorLoadingTariffs: IErrorsAxiosResponse;
	errorLoadingPortalSubsctription: IErrorsAxiosResponse;
	errorLoadingCreatingSubscription: IErrorsAxiosResponse;
	errorLoadingActivatingDemo: IErrorsAxiosResponse;
	errorLoadingDisablingRenewal: IErrorsAxiosResponse;
	errorLoadingDowngradeTariff: IErrorsAxiosResponse;
	errorLoadingRedirectToStripeUrl: IErrorsAxiosResponse;
}
