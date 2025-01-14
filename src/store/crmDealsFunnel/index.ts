import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IReason, IStage } from '@uspacy/sdk/lib/models/crm-stages';

import { sortStagesWhenCreateNew } from './../../helpers/sortStagesWhenCreateNew';
import {
	createDealsFunnel,
	createReasonsForDealsFunnelStage,
	createStageForDealsFunnel,
	deleteDealsFunnel,
	deleteReasonsForDealsFunnelStage,
	deleteStageForDealsFunnel,
	editDealsFunnel,
	editReasonsForDealsFunnelStage,
	editStageForDealsFunnel,
	fetchDealsFunnel,
	fetchStagesForDealsFunnel,
} from './actions';
import { IState } from './types';

const initialState = {
	dealsFunnel: [],
	dealsFunnelLoading: false,
	errorMessage: null,
	modalViewMode: false,
} as IState;

const dealsFunnelReducer = createSlice({
	name: 'dealsFunnel',
	initialState,
	reducers: {
		changeDealFunnelState: (state, action: PayloadAction<{ stages: IStage[]; funnelId: number }>) => {
			state.dealsFunnel = state.dealsFunnel.map((it) => (it.id === action.payload.funnelId ? { ...it, stages: action.payload.stages } : it));
		},
		changeDealFunnelReasons: (state, action: PayloadAction<{ reasons: IReason[]; stageId: number }>) => {
			state.dealsFunnel = state.dealsFunnel.map((funnel) => ({
				...funnel,
				stages: funnel.stages?.map((stage) => {
					return stage.id === action.payload.stageId ? { ...stage, reasons: action.payload.reasons } : stage;
				}),
			}));
		},
		changeModalViewMode: (state, action: PayloadAction<boolean>) => {
			state.modalViewMode = action.payload;
		},
	},
	extraReducers: {
		[fetchDealsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel[]>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = action.payload
				.map((funnel) => ({ ...funnel, tariff_limited: false }))
				.map((it) => ({ ...it, stages: it.stages.sort((a, b) => a.sort - b.sort) }));
		},
		[fetchDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[fetchDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[createDealsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel.push(action.payload);
		},
		[createDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[createDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[editDealsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = state.dealsFunnel.map((funnel) => {
				if (funnel?.id === action?.payload?.id) {
					return {
						...funnel,
						...action.payload,
					};
				}

				return funnel;
			});
		},
		[editDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[editDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[deleteDealsFunnel.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = state.dealsFunnel.filter((funnel) => funnel?.id !== action?.payload);
		},
		[deleteDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[deleteDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[createStageForDealsFunnel.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = state.dealsFunnel.map((funnel) => {
				if (funnel.id === action.payload.funnel_id) {
					return {
						...funnel,
						stages: sortStagesWhenCreateNew({ data: funnel.stages }, action.payload),
					};
				}
				return funnel;
			});
		},
		[createStageForDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[createStageForDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[editStageForDealsFunnel.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = state.dealsFunnel = state.dealsFunnel.map((funnel) => ({
				...funnel,
				stages: funnel.stages?.map((stage) => (stage.id === action.payload.id ? { ...stage, ...action.payload } : stage)),
			}));
		},
		[editStageForDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[editStageForDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[deleteStageForDealsFunnel.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = state.dealsFunnel.map((funnel) => {
				if (funnel.stages.some((stage) => stage.id === action.payload)) {
					return {
						...funnel,
						stages: funnel.stages.filter((stage) => stage.id !== action.payload),
					};
				}
				return funnel;
			});
		},
		[deleteStageForDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[deleteStageForDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[createReasonsForDealsFunnelStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = state.dealsFunnel.map((funnel) => {
				if (funnel.id === action.payload.funnel_id) {
					return {
						...funnel,
						stages: funnel.stages.map((stage) => {
							if (stage.stage_code === 'FAIL') {
								return {
									...stage,
									reasons: [...stage.reasons, action.payload],
								};
							}
							return stage;
						}),
					};
				}
				return funnel;
			});
		},
		[createReasonsForDealsFunnelStage.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[createReasonsForDealsFunnelStage.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[editReasonsForDealsFunnelStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = state.dealsFunnel = state.dealsFunnel.map((funnel) => ({
				...funnel,
				stages: funnel.stages?.map((stage) => ({
					...stage,
					reasons: stage.reasons?.map((reason) => (reason.id === action.payload.id ? { ...reason, ...action.payload } : reason)),
				})),
			}));
		},
		[editReasonsForDealsFunnelStage.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[editReasonsForDealsFunnelStage.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[deleteReasonsForDealsFunnelStage.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel.forEach((funnel) => {
				funnel.stages?.forEach((stage) => {
					stage.reasons = stage.reasons?.filter((reason) => reason.id !== action.payload);
				});
			});
		},
		[deleteReasonsForDealsFunnelStage.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[deleteReasonsForDealsFunnelStage.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[fetchStagesForDealsFunnel.fulfilled.type]: (state, action: PayloadAction<{ data: IStage[]; funnelId: number }>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			const { funnelId, data: stages } = action.payload;
			state.dealsFunnel = state.dealsFunnel.map((funnel) => {
				if (funnel.id === funnelId) {
					return {
						...funnel,
						stages: stages,
					};
				}
				return funnel;
			});
		},
		[fetchStagesForDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[fetchStagesForDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
	},
});
export default dealsFunnelReducer.reducer;
export const { changeDealFunnelState, changeDealFunnelReasons, changeModalViewMode } = dealsFunnelReducer.actions;
