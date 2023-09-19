/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IIntentPayload, ISubscriptionsIndividual, ISubscriptionsLegal } from '@uspacy/sdk/lib/services/AuthService/dto/subscription.dto';

export const fetchInvoices = createAsyncThunk('auth/fetchInvoices', async ({ limit }: { limit: number }, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getInvoices(limit);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchInvoicesPdf = createAsyncThunk('auth/fetchInvoicesPdf', async (id: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getInvoicesPdf(id);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchRatesList = createAsyncThunk('auth/fetchRatesList', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getRatesList();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchSubscription = createAsyncThunk('auth/fetchSubscription', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getSubscription();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const fetchCoupon = createAsyncThunk('auth/fetchCoupon', async (couponCode: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getCoupon(couponCode);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const subscriptionsIndividual = createAsyncThunk(
	'auth/subscriptionsIndividual',
	async (data: ISubscriptionsIndividual, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.authService.subscriptionInvdividual(data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const subscriptionsLegal = createAsyncThunk('auth/subscriptionsLegal', async (data: ISubscriptionsLegal, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.subscriptionLegal(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const activateDemo = createAsyncThunk('auth/activateDemo', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.activateDemo();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createPaymentIntent = createAsyncThunk('auth/createPaymentIntent', async (data: IIntentPayload, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.createPaymentIntent(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const disableSubscriptionsRenewal = createAsyncThunk('auth/disableSubscriptionsRenewal', async (auto_debit: boolean, { rejectWithValue }) => {
	try {
		await uspacySdk.authService.disableSubscriptionsRenewal(auto_debit);

		return auto_debit;
	} catch (e) {
		return rejectWithValue(e);
	}
});
