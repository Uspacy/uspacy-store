/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IDowngradePayload } from '@uspacy/sdk/lib/services/AuthService/dto/downgrade.dto';
import { IResponseGoogleData } from '@uspacy/sdk/lib/services/AuthService/dto/response-google-data.dto';
import {
	ICreateUsingPaymentIntent,
	IIndividualPayload,
	IIntentPayload,
	ILegalPayload,
	ISubscriptionPayload,
	ISubscriptionsIndividual,
	ISubscriptionsLegal,
} from '@uspacy/sdk/lib/services/AuthService/dto/subscription.dto';

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
		const res = await uspacySdk.authService.getCoupon(encodeURIComponent(couponCode));
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

export const createUsingPaymentIntent = createAsyncThunk(
	'auth/createUsingPaymentIntent',
	async (data: ICreateUsingPaymentIntent, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.authService.createUsingPaymentIntent(data);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const disableSubscriptionsRenewal = createAsyncThunk('auth/disableSubscriptionsRenewal', async (auto_debit: boolean, { rejectWithValue }) => {
	try {
		await uspacySdk.authService.disableSubscriptionsRenewal(auto_debit);

		return auto_debit;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const downgrade = createAsyncThunk('auth/downgrade', async (data: IDowngradePayload, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.downgrade(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getUrlToRedirectAfterOAuth = createAsyncThunk(
	'auth/getUrlToRedirectAfterOAuth',
	async (body: IResponseGoogleData, { rejectWithValue }) => {
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

export const getDiscountCoupon = createAsyncThunk('auth/getDiscountCoupon', async (couponCode: string, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.authService.getDiscountCoupon(couponCode);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
