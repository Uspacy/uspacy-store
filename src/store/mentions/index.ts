import { createSlice } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IMention } from '@uspacy/sdk/lib/models/mentions';

import { createMention, deleteMention, fetchMentions, fetchMentionsQuota, setEntityMention, updateMention } from './actions';
import { IState } from './types';

const initialState: IState = {
	data: [],
	quota: null,
	loading: false,
	loaded: false,
	error: null,
};

const upsert = (state: IState, mention: IMention) => {
	const index = state.data.findIndex(({ id }) => id === mention.id);
	if (index === -1) {
		state.data.push(mention);
	} else {
		state.data[index] = mention;
	}
};

const mentionsReducer = createSlice({
	name: 'mentions',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMentions.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMentions.fulfilled, (state, action) => {
				state.loading = false;
				state.loaded = true;
				state.data = action.payload;
			})
			.addCase(fetchMentions.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as IErrorsAxiosResponse;
			})
			.addCase(fetchMentionsQuota.fulfilled, (state, action) => {
				state.quota = action.payload;
			})
			.addCase(createMention.fulfilled, (state, action) => {
				upsert(state, action.payload);
				if (typeof state.quota?.custom?.left === 'number') {
					state.quota.custom.left = Math.max(0, state.quota.custom.left - 1);
				}
			})
			.addCase(updateMention.fulfilled, (state, action) => {
				upsert(state, action.payload);
			})
			.addCase(deleteMention.fulfilled, (state, action) => {
				const removed = state.data.find(({ id }) => id === action.payload);
				state.data = state.data.filter(({ id }) => id !== action.payload);
				if (removed?.type === 'custom' && typeof state.quota?.custom?.left === 'number') {
					state.quota.custom.left += 1;
				}
			})
			.addCase(setEntityMention.fulfilled, (state, action) => {
				const { type, entityId, mention } = action.payload;
				if (mention) {
					upsert(state, mention);
				} else {
					state.data = state.data.filter((it) => !(it.type === type && it.entityId === entityId));
				}
			});
	},
});

export default mentionsReducer.reducer;
