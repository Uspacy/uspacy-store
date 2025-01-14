import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IReason, IStage } from '@uspacy/sdk/lib/models/crm-stages';

import { sortStagesWhenCreateNew } from './../../helpers/sortStagesWhenCreateNew';
import {
	createLeadsFunnel,
	createReasonsForLeadsFunnelStage,
	createStageForLeadsFunnel,
	deleteLeadsFunnel,
	deleteReasonsForLeadsFunnelStage,
	deleteStageForLeadsFunnel,
	editLeadsFunnel,
	editReasonsForLeadsFunnelStage,
	editStageForLeadsFunnel,
	fetchLeadsFunnel,
} from './actions';
import { IState } from './types';

const initialState = {
	leadsFunnel: [],
	leadsFunnelLoading: false,
	errorMessage: null,
} as IState;

const leadsFunnelReducer = createSlice({
	name: 'leadsFunnel',
	initialState,
	reducers: {
		changeLeadFunnelStage: (state, action: PayloadAction<{ stages: IStage[]; funnelId: number }>) => {
			state.leadsFunnel = state.leadsFunnel.map((it) => (it.id === action.payload.funnelId ? { ...it, stages: action.payload.stages } : it));
		},
		changeLeadFunnelReasons: (state, action: PayloadAction<{ reasons: IReason[]; stageId: number }>) => {
			state.leadsFunnel = state.leadsFunnel.map((funnel) => ({
				...funnel,
				stages: funnel.stages?.map((stage) => {
					return stage.id === action.payload.stageId ? { ...stage, reasons: action.payload.reasons } : stage;
				}),
			}));
		},
	},
	extraReducers: {
		[fetchLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel[]>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = action.payload
				.map((funnel) => ({ ...funnel, tariff_limited: false }))
				.map((it) => ({ ...it, stages: it.stages.sort((a, b) => a.sort - b.sort) }));
		},
		[fetchLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[fetchLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[createLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel.push(action.payload);
		},
		[createLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[createLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[editLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = state.leadsFunnel.map((funnel) => {
				if (funnel?.id === action?.payload?.id) {
					return {
						...funnel,
						...action.payload,
					};
				}

				return funnel;
			});
		},
		[editLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[editLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[deleteLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = state.leadsFunnel.filter((funnel) => funnel?.id !== action?.payload);
		},
		[deleteLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[deleteLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[createStageForLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = state.leadsFunnel.map((funnel) => {
				if (funnel.id === action.payload.funnel_id) {
					return {
						...funnel,
						stages: sortStagesWhenCreateNew({ data: funnel.stages }, action.payload),
					};
				}
				return funnel;
			});
		},
		[createStageForLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[createStageForLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[editStageForLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = state.leadsFunnel = state.leadsFunnel.map((funnel) => ({
				...funnel,
				stages: funnel.stages?.map((stage) => (stage.id === action.payload.id ? { ...stage, ...action.payload } : stage)),
			}));
		},
		[editStageForLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[editStageForLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[deleteStageForLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = state.leadsFunnel.map((funnel) => {
				if (funnel.stages.some((stage) => stage.id === action.payload)) {
					return {
						...funnel,
						stages: funnel.stages.filter((stage) => stage.id !== action.payload),
					};
				}
				return funnel;
			});
		},
		[deleteStageForLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[deleteStageForLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[createReasonsForLeadsFunnelStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = state.leadsFunnel.map((funnel) => {
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
		[createReasonsForLeadsFunnelStage.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[createReasonsForLeadsFunnelStage.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[editReasonsForLeadsFunnelStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = state.leadsFunnel = state.leadsFunnel.map((funnel) => ({
				...funnel,
				stages: funnel.stages?.map((stage) => ({
					...stage,
					reasons: stage.reasons?.map((reason) => (reason.id === action.payload.id ? { ...reason, ...action.payload } : reason)),
				})),
			}));
		},
		[editReasonsForLeadsFunnelStage.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[editReasonsForLeadsFunnelStage.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
		[deleteReasonsForLeadsFunnelStage.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel.forEach((funnel) => {
				funnel.stages?.forEach((stage) => {
					stage.reasons = stage.reasons?.filter((reason) => reason.id !== action.payload);
				});
			});
		},
		[deleteReasonsForLeadsFunnelStage.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[deleteReasonsForLeadsFunnelStage.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
	},
});
export const { changeLeadFunnelStage, changeLeadFunnelReasons } = leadsFunnelReducer.actions;
export default leadsFunnelReducer.reducer;
