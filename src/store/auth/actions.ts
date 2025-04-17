/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IResponseOauthData } from '@uspacy/sdk/lib/services/AuthService/dto/response-oauth-data.dto';
import {
	IIndividualPayload,
	ILegalPayload,
	ISubscriptionPayload,
	ISubscriptionStripePayload,
} from '@uspacy/sdk/lib/services/AuthService/dto/subscription.dto';

export const getUrlToRedirectAfterOAuth = createAsyncThunk(
	'auth/getUrlToRedirectAfterOAuth',
	async (body: IResponseOauthData, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.authService.getUrlToRedirectAfterOAuth(body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

// ! NEW BILLING
export const getTariffsList = createAsyncThunk('auth/getTariffsList', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getTariffsList();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getPortalSubscription = createAsyncThunk('auth/getPortalSubscription', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getPortalSubscription();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const createSubscriptionInvdividual = createAsyncThunk(
	'auth/createSubscriptionInvdividual',
	async (body: IIndividualPayload, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.authService.createSubscriptionInvdividual(body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const createSubscriptionLegal = createAsyncThunk('auth/createSubscriptionLegal', async (body: ILegalPayload, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.createSubscriptionLegal(body);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const redirectToStripe = createAsyncThunk('auth/redirectToStripe', async (body: ISubscriptionStripePayload, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.redirectToStripe(body);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const activatingDemo = createAsyncThunk('auth/activatingDemo', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.activatingDemo();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const disableSubscriptionRenewal = createAsyncThunk('auth/disableSubscriptionRenewal', async (_, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.disableSubscriptionRenewal();
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const downgradeTariff = createAsyncThunk(
	'auth/downgradeTariff',
	async (body: Pick<ISubscriptionPayload, 'plan_code' | 'quantity'>, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.authService.downgradeTariff(body);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
