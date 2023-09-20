import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ICoupon, IIntent, IInvoiceData, IInvoices, IRatesList, ISubscription } from '@uspacy/sdk/lib/models/tariffs';

import {
	activateDemo,
	createPaymentIntent,
	disableSubscriptionsRenewal,
	downgrade,
	fetchCoupon,
	fetchInvoices,
	fetchInvoicesPdf,
	fetchRatesList,
	fetchSubscription,
	subscriptionsIndividual,
	subscriptionsLegal,
} from './actions';
import { IState } from './types';

const initialState = {
	invoices: {},
	invoice: {},
	ratesList: {},
	subscription: [],
	coupon: {},
	intent: {},
	downloadPdfLink: '',
	loadingInvoices: false,
	loadingPdfLink: false,
	loadingRatesList: false,
	loadingSubscription: false,
	loadingSubscriptionItem: false,
	loadingCoupon: false,
	loadingPaymentIntent: false,
	loadingSubscriptionRenewal: false,
	loadingActivateDemo: false,
	loadingDowngrade: false,
	errorLoadingInvoices: null,
	errorLoadingPdfLink: null,
	errorLoadingRatesList: null,
	errorloadingSubscription: null,
	errorloadingSubscriptionItem: null,
	errorLoadingCoupon: null,
	errorLoadingPaymentIntent: null,
	errorLoadingSubscriptionRenewal: null,
	errorActivateDemo: null,
	errorLoadingDowngrade: null,
} as IState;

const authReducer = createSlice({
	name: 'authReducer',
	initialState,
	reducers: {
		clearPdfLink: (state) => {
			state.downloadPdfLink = '';
		},
		clearInvoice: (state) => {
			state.invoice = {} as IInvoiceData;
		},
		clearIntent: (state) => {
			state.intent = {} as IIntent;
		},
		clearCoupon: (state) => {
			state.coupon = {} as ICoupon;
		},
		setSubscription: (state, action: PayloadAction<ISubscription[]>) => {
			state.subscription = action.payload;
		},
		setActiveSubscription: (state, action: PayloadAction<ISubscription>) => {
			state.activeSubscription = action.payload;
		},
		setAutoDebit: (state, action: PayloadAction<boolean>) => {
			state.activeSubscription.auto_debit = action.payload;
		},
	},
	extraReducers: {
		[fetchInvoices.fulfilled.type]: (state, action: PayloadAction<IInvoices>) => {
			state.loadingInvoices = false;
			state.errorLoadingInvoices = null;
			state.invoices = action.payload;
		},
		[fetchInvoices.pending.type]: (state) => {
			state.loadingInvoices = true;
			state.errorLoadingInvoices = null;
		},
		[fetchInvoices.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingInvoices = false;
			state.errorLoadingInvoices = action.payload;
		},

		[fetchInvoicesPdf.fulfilled.type]: (state, action: PayloadAction<{ download_url: string }>) => {
			state.loadingPdfLink = false;
			state.errorLoadingPdfLink = null;
			state.downloadPdfLink = action.payload.download_url;
		},
		[fetchInvoicesPdf.pending.type]: (state) => {
			state.loadingPdfLink = true;
			state.errorLoadingPdfLink = null;
		},
		[fetchInvoicesPdf.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingPdfLink = false;
			state.errorLoadingPdfLink = action.payload;
		},

		[fetchRatesList.fulfilled.type]: (state, action: PayloadAction<IRatesList>) => {
			state.loadingRatesList = false;
			state.errorLoadingRatesList = null;
			state.ratesList = action.payload;
		},
		[fetchRatesList.pending.type]: (state) => {
			state.loadingRatesList = true;
			state.errorLoadingRatesList = null;
		},
		[fetchRatesList.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRatesList = false;
			state.errorLoadingRatesList = action.payload;
		},

		[fetchSubscription.fulfilled.type]: (state, action: PayloadAction<ISubscription[]>) => {
			state.loadingSubscriptionItem = false;
			state.errorloadingSubscriptionItem = null;
			state.subscription = action.payload;
			// state.activeSubscription = action.payload[0];
			state.activeSubscription = action.payload.filter(({ status }) => status === 'active' || status === 'non_renewing')[0];
		},
		[fetchSubscription.pending.type]: (state) => {
			state.loadingSubscriptionItem = true;
			state.errorloadingSubscriptionItem = null;
		},
		[fetchRatesList.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSubscriptionItem = false;
			state.errorloadingSubscriptionItem = action.payload;
		},

		[fetchCoupon.fulfilled.type]: (state, action: PayloadAction<ICoupon>) => {
			state.loadingCoupon = false;
			state.errorLoadingCoupon = null;
			state.coupon = action.payload;
		},
		[fetchCoupon.pending.type]: (state) => {
			state.loadingCoupon = true;
			state.errorLoadingCoupon = null;
		},
		[fetchCoupon.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCoupon = false;
			state.errorLoadingCoupon = action.payload;
		},

		[subscriptionsIndividual.fulfilled.type]: (state, action: PayloadAction<IInvoiceData>) => {
			state.loadingSubscription = false;
			state.errorloadingSubscription = null;
			state.invoice = action.payload;
			if (state.invoices.data) {
				state.invoices.data.invoices.unshift(action.payload);
			}
		},
		[subscriptionsIndividual.pending.type]: (state) => {
			state.loadingSubscription = true;
			state.errorloadingSubscription = null;
		},
		[subscriptionsIndividual.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSubscription = false;
			state.errorloadingSubscription = action.payload;
		},

		[subscriptionsLegal.fulfilled.type]: (state, action: PayloadAction<IInvoiceData>) => {
			state.loadingSubscription = false;
			state.errorloadingSubscription = null;
			state.invoice = action.payload;
			if (state.invoices.data) {
				state.invoices.data.invoices.unshift(action.payload);
			}
		},
		[subscriptionsLegal.pending.type]: (state) => {
			state.loadingSubscription = true;
			state.errorloadingSubscription = null;
		},
		[subscriptionsLegal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSubscription = false;
			state.errorloadingSubscription = action.payload;
		},

		[activateDemo.fulfilled.type]: (state, action: PayloadAction<ISubscription>) => {
			state.loadingActivateDemo = false;
			state.errorActivateDemo = null;
			state.activeSubscription = action.payload;
			state.activeSubscription.current_term_end = action.payload.current_term_end + 1123200;
		},
		[activateDemo.pending.type]: (state) => {
			state.loadingActivateDemo = true;
			state.errorActivateDemo = null;
		},
		[activateDemo.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingActivateDemo = false;
			state.errorActivateDemo = action.payload;
		},

		[createPaymentIntent.fulfilled.type]: (state, action: PayloadAction<IIntent>) => {
			state.loadingPaymentIntent = false;
			state.errorLoadingPaymentIntent = null;
			state.intent = action.payload;
		},
		[createPaymentIntent.pending.type]: (state) => {
			state.loadingPaymentIntent = true;
			state.errorLoadingPaymentIntent = null;
		},
		[createPaymentIntent.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingPaymentIntent = false;
			state.errorLoadingPaymentIntent = action.payload;
		},
		[disableSubscriptionsRenewal.fulfilled.type]: (state, action: PayloadAction<boolean>) => {
			state.loadingSubscriptionRenewal = false;
			state.errorLoadingSubscriptionRenewal = null;
			state.activeSubscription.auto_debit = action.payload;
		},
		[disableSubscriptionsRenewal.pending.type]: (state) => {
			state.loadingSubscriptionRenewal = true;
			state.errorLoadingSubscriptionRenewal = null;
		},
		[disableSubscriptionsRenewal.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSubscriptionRenewal = false;
			state.errorLoadingSubscriptionRenewal = action.payload;
		},
		[downgrade.fulfilled.type]: (state) => {
			state.loadingDowngrade = false;
			state.errorLoadingDowngrade = null;
		},
		[downgrade.pending.type]: (state) => {
			state.loadingDowngrade = true;
			state.errorLoadingDowngrade = null;
		},
		[downgrade.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDowngrade = false;
			state.errorLoadingDowngrade = action.payload;
		},
	},
});

export const { clearPdfLink, clearInvoice, setSubscription, setActiveSubscription, clearIntent, clearCoupon, setAutoDebit } = authReducer.actions;
export default authReducer.reducer;
