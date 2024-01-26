import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IColumns } from '@uspacy/sdk/lib/models/crm-kanban';
import { IReason, IReasons, IStage, IStages } from '@uspacy/sdk/lib/models/crm-stages';

import { changeCRMColumn } from './../../helpers/changeColumn';
import { sortStagesWhenCreateNew } from './../../helpers/sortStagesWhenCreateNew';
import {
	createLeadsStage,
	createReasonsForLeadsStage,
	deleteLeadsStage,
	deleteReasonsForLeadsStage,
	editLeadsStage,
	editReasonForLeadsStage,
	fetchLeadsStages,
	fetchReasonsForLead,
} from './actions';
import { IState } from './types';

const initialState = {
	stages: {
		data: [],
	},
	stage: {},
	errorMessage: '',
	loading: false,
	reasonsLoading: false,
	leadsColumns: {},
	reasons: {},
} as IState;

const leadsStagesReducer = createSlice({
	name: 'leads',
	initialState,
	reducers: {
		changeLeadsColumnsState: (state, action: PayloadAction<{ data: IColumns; isColumnsChanged: boolean }>) => {
			state.leadsColumns = action.payload.data;

			const { isUpdateStages, newStageArray } = changeCRMColumn(action.payload.data, action.payload.isColumnsChanged, state.stages.data);

			if (isUpdateStages) {
				state.stages.data = newStageArray;
			}
		},
		changeLeadStagesSortState: (state, action: PayloadAction<IStage[]>) => {
			state.stages.data = action.payload;
		},
		changeSortingForLeadsReasons: (state, action: PayloadAction<IReason[]>) => {
			state.reasons.FAIL = action.payload;
		},
		changeLeadsStagesFromFunnelState: (state, action: PayloadAction<IStage[]>) => {
			if (action.payload === undefined) {
				return;
			}
			state.stages.data = action.payload;
			state.reasons.FAIL = action?.payload.filter((stage) => stage.stage_code === 'FAIL').flatMap((stage) => stage.reasons);
		},
		changeLeadItem: (state, action: PayloadAction<IEntityData>) => {
			state.leadsColumns = Object.entries(state.leadsColumns).reduce((acc, [key, value]) => {
				// @ts-ignore
				const findObject = value.items.map((el) => +el.id).includes(action.payload?.id || 0);
				if (findObject) {
					const newObject = {
						// @ts-ignore
						...value,
						// @ts-ignore
						items: value.items.map((it) =>
							+it.id === +action.payload.id
								? {
										...it,
										title: action.payload?.title || it?.title,
										preparedTitle: action.payload?.title || it?.title,
										...action.payload,
										id: String(it.id),
								  }
								: it,
						),
					};
					return { ...acc, [key]: newObject };
				} else {
					return { ...acc, [key]: value };
				}
			}, {});
		},
		clearLeadColumns: (state) => {
			state.leadsColumns = Object.entries(state.leadsColumns).reduce((acc, [key, value]) => {
				// @ts-ignore
				return { ...acc, [key]: { ...value, items: [], total: 0 } };
			}, {});
		},
	},
	extraReducers: {
		[fetchLeadsStages.fulfilled.type]: (state, action: PayloadAction<IStages>) => {
			state.loading = false;
			state.errorMessage = '';
			state.stages = action.payload;
		},
		[fetchLeadsStages.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchLeadsStages.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createLeadsStage.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
			state.loading = false;
			state.errorMessage = '';
			state.stages.data = sortStagesWhenCreateNew(state.stages, action.payload);
		},
		[createLeadsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createLeadsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editLeadsStage.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
			state.loading = false;
			state.errorMessage = '';
			state.stages.data = state.stages.data.map((task) => {
				if (task?.id === action?.payload?.id) {
					return {
						...task,
						...action.payload,
					};
				}
				return task;
			});
		},
		[editLeadsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editLeadsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteLeadsStage.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.stages.data = state.stages.data
				.filter((stage) => stage?.id !== action?.payload)
				.map((item, index) => ({ ...item, sort: index * 10 }));
		},
		[deleteLeadsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteLeadsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchReasonsForLead.fulfilled.type]: (state, action: PayloadAction<IReasons>) => {
			state.loading = false;
			state.errorMessage = '';
			state.reasons = action.payload;
		},
		[fetchReasonsForLead.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchReasonsForLead.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createReasonsForLeadsStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.reasonsLoading = false;
			state.errorMessage = '';
			state.reasons.FAIL.push(action.payload);
		},
		[createReasonsForLeadsStage.pending.type]: (state) => {
			state.reasonsLoading = true;
			state.errorMessage = '';
		},
		[createReasonsForLeadsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.reasonsLoading = false;
			state.errorMessage = action.payload;
		},
		[editReasonForLeadsStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.loading = false;
			state.reasonsLoading = false;
			state.errorMessage = '';
			state.reasons.FAIL = state.reasons.FAIL.map((reason) => {
				if (reason?.id === action?.payload?.id) {
					return action.payload;
				}
				return reason;
			});
		},
		[editReasonForLeadsStage.pending.type]: (state) => {
			state.reasonsLoading = true;
			state.loading = true;
			state.errorMessage = '';
		},
		[editReasonForLeadsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.reasonsLoading = false;
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteReasonsForLeadsStage.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.reasonsLoading = false;
			state.loading = false;
			state.errorMessage = '';
			state.reasons.FAIL = state.reasons.FAIL.filter((reason) => reason?.id !== action?.payload);
		},
		[deleteReasonsForLeadsStage.pending.type]: (state) => {
			state.reasonsLoading = true;
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteReasonsForLeadsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.reasonsLoading = false;
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const {
	changeLeadsColumnsState,
	changeLeadStagesSortState,
	changeSortingForLeadsReasons,
	changeLeadsStagesFromFunnelState,
	changeLeadItem,
	clearLeadColumns,
} = leadsStagesReducer.actions;
export default leadsStagesReducer.reducer;
