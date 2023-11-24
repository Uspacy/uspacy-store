/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ICountryTemplates, IRequisite, IRequisitesResponse, ITemplate, ITemplateResponse } from '@uspacy/sdk/lib/models/requisites';
import { IUser } from '@uspacy/sdk/lib/models/user';

import {
	createTemplate,
	fetchBasicTemplates,
	fetchProfile,
	fetchRequisites,
	fetchTemplates,
	removeRequisite,
	removeTemplate,
	updateRequisite,
	updateTemplate,
} from './actions';
import { IState } from './types';

const initialState: IState = {
	loading: true,
	loadingTemplates: {
		loadingCreateTemplates: false,
		loadingReadTemplates: false,
		loadingUpdateTemplates: false,
		loadingDeleteTemplates: false,
	},
	loadingRequisites: {
		loadingCreateRequisites: false,
		loadingReadRequisites: false,
		loadingUpdateRequisites: false,
		loadingDeleteRequisites: false,
	},
	errorLoading: null,
};

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		clearProfile(state) {
			state.data = undefined;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
	},
	extraReducers: {
		[fetchProfile.fulfilled.type]: (state: IState, action: PayloadAction<IUser>) => {
			state.loading = false;
			state.data = action.payload;
			state.currentRequestId = undefined;
		},
		[fetchProfile.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loading = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[fetchProfile.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loading = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[fetchRequisites.fulfilled.type]: (state: IState, action: PayloadAction<IRequisitesResponse>) => {
			state.loadingRequisites.loadingReadRequisites = false;
			state.requisites = action.payload.data;
			state.currentRequestId = undefined;
		},
		[fetchRequisites.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingRequisites.loadingReadRequisites = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[fetchRequisites.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRequisites.loadingReadRequisites = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[updateRequisite.fulfilled.type]: (state: IState, action: PayloadAction<IRequisite>) => {
			const reqId = action.payload;
			state.loadingRequisites.loadingUpdateRequisites = false;
			state.requisites = state.requisites.map((req) => {
				if (req.id === reqId.id) return { ...req, is_basic: true };
				return { ...req, is_basic: false };
			});
			state.currentRequestId = undefined;
		},
		[updateRequisite.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingRequisites.loadingUpdateRequisites = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[updateRequisite.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRequisites.loadingUpdateRequisites = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[removeRequisite.fulfilled.type]: (state: IState, action: PayloadAction<number>) => {
			const removedReqId = action.payload;
			state.loadingRequisites.loadingDeleteRequisites = false;
			state.requisites = state.requisites.filter((req) => req.id !== removedReqId);
			state.currentRequestId = undefined;
		},
		[removeRequisite.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingRequisites.loadingDeleteRequisites = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[removeRequisite.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRequisites.loadingDeleteRequisites = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[fetchTemplates.fulfilled.type]: (state: IState, action: PayloadAction<ITemplateResponse>) => {
			state.loadingTemplates.loadingReadTemplates = false;
			state.templates = action.payload.data;
			state.currentRequestId = undefined;
		},
		[fetchTemplates.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingTemplates.loadingReadTemplates = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[fetchTemplates.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTemplates.loadingReadTemplates = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[fetchBasicTemplates.fulfilled.type]: (state: IState, action: PayloadAction<ICountryTemplates[]>) => {
			state.loadingTemplates.loadingReadTemplates = false;
			state.basicTemplates = action.payload;
			state.currentRequestId = undefined;
		},
		[fetchBasicTemplates.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingTemplates.loadingReadTemplates = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[fetchBasicTemplates.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTemplates.loadingReadTemplates = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[createTemplate.fulfilled.type]: (state: IState, action: PayloadAction<ITemplate>) => {
			state.loadingTemplates.loadingCreateTemplates = false;
			state.templates = [action.payload, ...state.templates];
			state.currentRequestId = undefined;
		},
		[createTemplate.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingTemplates.loadingCreateTemplates = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[createTemplate.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTemplates.loadingCreateTemplates = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[updateTemplate.fulfilled.type]: (state: IState, action: PayloadAction<ITemplate>) => {
			const tempId = action.payload;
			state.loadingTemplates.loadingUpdateTemplates = false;
			state.templates = state.templates.map((temp) => {
				if (temp.id === tempId.id) return { ...action.payload };
				return temp;
			});
			state.currentRequestId = undefined;
		},
		[updateTemplate.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingTemplates.loadingUpdateTemplates = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[updateTemplate.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTemplates.loadingUpdateTemplates = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
		[removeTemplate.fulfilled.type]: (state: IState, action: PayloadAction<number>) => {
			const removedTemplateId = action.payload;
			state.loadingTemplates.loadingDeleteTemplates = false;
			state.templates = state.templates.filter((template) => template.id !== removedTemplateId);
			state.currentRequestId = undefined;
		},
		[removeTemplate.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loadingTemplates.loadingDeleteTemplates = true;
			state.errorLoading = null;
			state.currentRequestId = action.meta.requestId;
		},
		[removeTemplate.rejected.type]: (state: IState, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingTemplates.loadingDeleteTemplates = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
	},
});

export default profileSlice.reducer;
