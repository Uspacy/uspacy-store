import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IReason, IReasonsCreate, IStage } from '@uspacy/sdk/lib/models/crm-stages';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import {
	createFunnel,
	createReason,
	createStage,
	deleteFunnel,
	deleteReason,
	deleteStage,
	fetchFunnels,
	fetchStages,
	updateFunnel,
	updateReason,
	updateStage,
} from './actions';
import { EntityFunnels, IState } from './types';

const initialState: IState = {};

const funnelsReducer = createSlice({
	name: 'crm/funnels',
	initialState,
	reducers: {
		replaceReasons: (state, action: PayloadAction<{ data: IReason[]; funnelId: number; stageId: number; entityCode: string }>) => {
			const entityCode = action.payload.entityCode;
			state[entityCode].data = state[entityCode].data.map((funnel) => {
				if (funnel.id === action.payload.funnelId) {
					return {
						...funnel,
						stages: funnel.stages?.map((stage) => {
							return stage.id === action.payload.stageId ? { ...stage, reasons: action.payload.data } : stage;
						}),
					};
				}
				return funnel;
			});
		},
	},
	extraReducers: {
		[fetchFunnels.fulfilled.type]: (state, action: PayloadAction<IFunnel[], string, { arg: string }>) => {
			state[action.meta.arg].loading = false;
			state[action.meta.arg].errorMessage = null;
			// @ts-ignore
			state[action.meta.arg].data = action.payload
				.map((it) => ({...it, permissions: { create: 'allowed', view: 'allowed', edit: 'mine' }}))
				.map((funnel) => {
					const stages = funnel.stages.map((stage) => ({ ...stage, sort: Number(stage.sort) })).sort((a, b) => a.sort - b.sort);
					return {
						...funnel,
						stages: stages.map((stage) => ({
							...stage,
							reasons: stage.reasons.sort((a, b) => a.sort - b.sort),
						})),
					};
				})
				.map((it) => (it.title === 'Universal funnel' ? { ...it, title: 'newDirection' } : it));
		},
		[fetchFunnels.pending.type]: (state, action: PayloadAction<unknown, string, { arg: string }>) => {
			if (!state[action.meta.arg]) {
				state[action.meta.arg] = { loading: true } as EntityFunnels;
			}
			state[action.meta.arg].loading = true;
			state[action.meta.arg].errorMessage = null;
		},
		[fetchFunnels.rejected.type]: (state, action: PayloadAction<string, string, { arg: string }>) => {
			state[action.meta.arg].loading = false;
			state[action.meta.arg].errorMessage = action.payload;
		},

		[fetchStages.fulfilled.type]: (
			state,
			action: PayloadAction<IResponseWithMeta<IStage>, string, { arg: { entityCode: string; funnelId?: number } }>,
		) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((funnel) => {
				if (funnel.id === action.meta.arg.funnelId) {
					const stages = action.payload.data.sort((a, b) => a.sort - b.sort);
					return {
						...funnel,
						stages: stages.map((stage) => ({
							...stage,
							reasons: stage.reasons.sort((a, b) => a.sort - b.sort),
						})),
					};
				}
				return funnel;
			});
		},

		[createFunnel.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { entityCode: string } }>) => {
			const entityCode = action.meta.arg.entityCode;
			if (!state[entityCode]) {
				state[entityCode] = { loading: false, data: [] } as EntityFunnels;
			}
		},
		[createFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel, string, { arg: { data: Partial<IFunnel>; entityCode: string } }>) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data.push(action.payload);
		},

		[updateFunnel.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { data: Partial<IFunnel>; entityCode: string } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.map((it) => {
				if (it.id === action.meta.arg.data.id) {
					return { ...it, ...action.meta.arg.data };
				}
				return it;
			});
		},

		[deleteFunnel.fulfilled.type]: (state, action: PayloadAction<unknown, string, { arg: { id: number; entityCode: string } }>) => {
			state[action.meta.arg.entityCode].data = state[action.meta.arg.entityCode].data.filter((it) => it.id !== action.meta.arg.id);
		},

		[createStage.fulfilled.type]: (state, action: PayloadAction<IStage, string, { arg: { data: Partial<IStage>; entityCode: string } }>) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((funnel) => {
				if (funnel.id === action.meta.arg.data.funnel_id) {
					return {
						...funnel,
						stages: [
							{ ...action.payload, sort: Number(action.payload.sort) },
							...funnel.stages.map((stage) => {
								if (stage.sort >= action.payload.sort) {
									return { ...stage, sort: stage.sort + 10 };
								}
								return stage;
							}),
						].sort((a, b) => a.sort - b.sort),
					};
				}
				return funnel;
			});
		},

		[updateStage.pending.type]: (state, action: PayloadAction<unknown, string, { arg: { data: Partial<IStage>; entityCode: string } }>) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((it) => {
				return {
					...it,
					stages: it.stages
						.map((stage) => {
							if (stage.id === action.meta.arg.data.id) return { ...stage, ...action.meta.arg.data };
							if (stage.sort >= action.meta.arg.data?.sort) {
								return { ...stage, sort: stage.sort + 10 };
							}
							return stage;
						})
						.sort((a, b) => a.sort - b.sort),
				};
			});
		},

		[deleteStage.fulfilled.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { id: number; entityCode: string; funnelId?: number } }>,
		) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((it) => {
				if (it.id === action.meta.arg.funnelId) {
					return {
						...it,
						stages: it.stages.filter((stage) => stage.id !== action.meta.arg.id),
					};
				}
				return it;
			});
		},

		[createReason.fulfilled.type]: (state, action: PayloadAction<IReason, string, { arg: { data: IReasonsCreate; entityCode: string } }>) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((it) => {
				if (it.id === action.meta.arg.data.funnelId) {
					return {
						...it,
						stages: it.stages.map((stage) => {
							if (stage.stage_code === action.meta.arg.data.type) {
								return {
									...stage,
									reasons: [...stage.reasons, action.payload],
								};
							}
							return stage;
						}),
					};
				}
				return it;
			});
		},
		[updateReason.pending.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { data: IReason; funnelId: number; entityCode: string } }>,
		) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((it) => {
				if (it.id === action.meta.arg.funnelId) {
					return {
						...it,
						stages: it.stages.map((stage) => {
							return {
								...stage,
								reasons: stage.reasons.map((reason) => {
									if (reason.id === action.meta.arg.data.id) {
										return { ...reason, ...action.meta.arg.data };
									}
									return reason;
								}),
							};
						}),
					};
				}
				return it;
			});
		},
		[deleteReason.fulfilled.type]: (
			state,
			action: PayloadAction<unknown, string, { arg: { id: number; funnelId: number; entityCode: string } }>,
		) => {
			const entityCode = action.meta.arg.entityCode;
			state[entityCode].data = state[entityCode].data.map((it) => {
				if (it.id === action.meta.arg.funnelId) {
					return {
						...it,
						stages: it.stages.map((stage) => {
							return {
								...stage,
								reasons: stage.reasons.filter((reason) => reason.id !== action.meta.arg.id),
							};
						}),
					};
				}
				return it;
			});
		},
	},
});
export const { replaceReasons } = funnelsReducer.actions;
export default funnelsReducer.reducer;
