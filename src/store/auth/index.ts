import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IAfterOauthResponse } from '@uspacy/sdk/lib/models/oauthIntegrations';
import { IBill, IPortalSubscription, IStripeRedirect, ITariff } from '@uspacy/sdk/lib/models/tariffs';

import { TWO_WEEK_TIME_VALUE } from '../../const';
import {
	activatingDemo,
	createSubscriptionInvdividual,
	createSubscriptionLegal,
	disableSubscriptionRenewal,
	downgradeTariff,
	getPortalSubscription,
	getTariffsList,
	getUrlToRedirectAfterOAuth,
	redirectToStripe,
} from './actions';
import { IState } from './types';

const initialState = {
	afterGoogleOAuthData: {},
	tariffs: [],
	portalSubsctription: null,
	bill: null,
	redirectToStripeUrl: '',
	loadingAfterGoogleOAuth: false,
	loadingTariffs: false,
	loadingPortalSubsctription: false,
	loadingCreatingSubscription: false,
	loadingActivatingDemo: false,
	loadingDisablingRenewal: false,
	loadingDowngradeTariff: false,
	loadingRedirectToStripeUrl: false,
	errorLoadingAfterGoogleOAuth: null,
	errorLoadingTariffs: null,
	errorLoadingPortalSubsctription: null,
	errorLoadingCreatingSubscription: null,
	errorLoadingActivatingDemo: null,
	errorLoadingDisablingRenewal: null,
	errorLoadingDowngradeTariff: null,
	errorLoadingRedirectToStripeUrl: null,
} as IState;

const authReducer = createSlice({
	name: 'authReducer',
	initialState,
	reducers: {
		setAfterGoogleOAuthData: (state, action: PayloadAction<IAfterOauthResponse>) => {
			state.afterGoogleOAuthData = action.payload;
		},
		clearBill: (state) => {
			state.bill = initialState.bill;
		},
		setPortalSubscription: (state, action: PayloadAction<IPortalSubscription>) => {
			state.portalSubsctription = action.payload;
		},
		setAutoRenewal: (state, action: PayloadAction<boolean>) => {
			state.portalSubsctription.auto_renewal = action.payload;
		},
		setRedirectToStripeUrl: (state, action: PayloadAction<IStripeRedirect>) => {
			state.redirectToStripeUrl = action.payload.url;
		},
	},
	extraReducers: {
		[getUrlToRedirectAfterOAuth.fulfilled.type]: (state, action: PayloadAction<IAfterOauthResponse>) => {
			state.loadingAfterGoogleOAuth = false;
			state.errorLoadingAfterGoogleOAuth = null;
			state.afterGoogleOAuthData = action.payload;
		},
		[getUrlToRedirectAfterOAuth.pending.type]: (state) => {
			state.loadingAfterGoogleOAuth = true;
			state.errorLoadingAfterGoogleOAuth = null;
		},
		[getUrlToRedirectAfterOAuth.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingAfterGoogleOAuth = false;
			state.errorLoadingAfterGoogleOAuth = action.payload;
		},

		// ! NEW BILLING
		[getTariffsList.fulfilled.type]: (state, action: PayloadAction<ITariff[]>) => {
			state.loadingTariffs = false;
			state.errorLoadingTariffs = null;
			state.tariffs = action.payload;
		},
		[getTariffsList.pending.type]: (state) => {
			state.loadingTariffs = true;
			state.errorLoadingTariffs = null;
		},
		[getTariffsList.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTariffs = false;
			state.errorLoadingTariffs = action.payload;
		},
		[getPortalSubscription.fulfilled.type]: (state, action: PayloadAction<IPortalSubscription>) => {
			state.loadingPortalSubsctription = false;
			state.errorLoadingPortalSubsctription = null;
			state.portalSubsctription = action.payload;
		},
		[getPortalSubscription.pending.type]: (state) => {
			state.loadingPortalSubsctription = true;
			state.errorLoadingPortalSubsctription = null;
		},
		[getPortalSubscription.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingPortalSubsctription = false;
			state.errorLoadingPortalSubsctription = action.payload;
		},
		[createSubscriptionInvdividual.fulfilled.type]: (state, action: PayloadAction<IBill>) => {
			state.loadingCreatingSubscription = false;
			state.errorLoadingCreatingSubscription = null;
			state.bill = action.payload;
		},
		[createSubscriptionInvdividual.pending.type]: (state) => {
			state.loadingCreatingSubscription = true;
			state.errorLoadingCreatingSubscription = null;
		},
		[createSubscriptionInvdividual.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingSubscription = false;
			state.errorLoadingCreatingSubscription = action.payload;
		},
		[createSubscriptionLegal.fulfilled.type]: (state, action: PayloadAction<IBill>) => {
			state.loadingCreatingSubscription = false;
			state.errorLoadingCreatingSubscription = null;
			state.bill = action.payload;
		},
		[createSubscriptionLegal.pending.type]: (state) => {
			state.loadingCreatingSubscription = true;
			state.errorLoadingCreatingSubscription = null;
		},
		[createSubscriptionLegal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingSubscription = false;
			state.errorLoadingCreatingSubscription = action.payload;
		},
		[redirectToStripe.fulfilled.type]: (state, action: PayloadAction<IStripeRedirect>) => {
			state.loadingRedirectToStripeUrl = false;
			state.errorLoadingRedirectToStripeUrl = null;
			state.redirectToStripeUrl = action.payload.url;
		},
		[redirectToStripe.pending.type]: (state) => {
			state.loadingRedirectToStripeUrl = true;
			state.errorLoadingRedirectToStripeUrl = null;
		},
		[redirectToStripe.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRedirectToStripeUrl = false;
			state.errorLoadingRedirectToStripeUrl = action.payload;
		},
		[activatingDemo.fulfilled.type]: (state) => {
			state.loadingActivatingDemo = false;
			state.errorLoadingActivatingDemo = null;
			state.portalSubsctription = {
				...state.portalSubsctription,
				plan_title: 'demo',
				plan: 'demo',
				plan_end: state.portalSubsctription.plan_end + TWO_WEEK_TIME_VALUE,
				demo_activation: true,
			};
		},
		[activatingDemo.pending.type]: (state) => {
			state.loadingActivatingDemo = true;
			state.errorLoadingActivatingDemo = null;
		},
		[activatingDemo.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingActivatingDemo = false;
			state.errorLoadingActivatingDemo = action.payload;
		},
		[disableSubscriptionRenewal.fulfilled.type]: (state) => {
			state.loadingDisablingRenewal = false;
			state.errorLoadingDisablingRenewal = null;
		},
		[disableSubscriptionRenewal.pending.type]: (state) => {
			state.loadingDisablingRenewal = true;
			state.errorLoadingDisablingRenewal = null;
		},
		[disableSubscriptionRenewal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDisablingRenewal = false;
			state.errorLoadingDisablingRenewal = action.payload;
		},
		[downgradeTariff.fulfilled.type]: (state, action: PayloadAction<IPortalSubscription>) => {
			state.loadingDowngradeTariff = false;
			state.errorLoadingDowngradeTariff = null;
			state.portalSubsctription = action.payload;
		},
		[downgradeTariff.pending.type]: (state) => {
			state.loadingDowngradeTariff = true;
			state.errorLoadingDowngradeTariff = null;
		},
		[downgradeTariff.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDowngradeTariff = false;
			state.errorLoadingDowngradeTariff = action.payload;
		},
	},
});

export const { setAfterGoogleOAuthData, clearBill, setAutoRenewal, setPortalSubscription, setRedirectToStripeUrl } = authReducer.actions;
export default authReducer.reducer;
