import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IColumns } from '@uspacy/sdk/lib/models/crm-kanban';
import { IReason, IReasons, IStage, IStages } from '@uspacy/sdk/lib/models/crm-stages';

import { sortStagesWhenCreateNew } from './../../helpers/sortStagesWhenCreateNew';
import {
	createDealsStage,
	createReasonsForDealsStage,
	deleteDealsStage,
	deleteReasonsForDealsStage,
	editDealsStage,
	editReasonForDealsStage,
	fetchDealsStages,
	fetchReasonsForDeals,
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
	dealsColumns: {},
	reasons: {},
} as IState;

const dealsStagesReducer = createSlice({
	name: 'deals',
	initialState,
	reducers: {
		changeDealsColumnsState: (state, action: PayloadAction<{ data: IColumns; isColumnsChanged: boolean }>) => {
			state.dealsColumns = action.payload.data;
		},
		changeDealsStagesSortState: (state, action: PayloadAction<IStage[]>) => {
			state.stages.data = action.payload;
		},
		changeSortingForDealsReasons: (state, action: PayloadAction<IReason[]>) => {
			state.reasons.FAIL = action.payload;
		},
		changeDealItem: (state, action: PayloadAction<IEntityData>) => {
			state.dealsColumns = Object.entries(state.dealsColumns).reduce((acc, [key, value]) => {
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
	},
	extraReducers: {
		[fetchDealsStages.fulfilled.type]: (state, action: PayloadAction<IStages>) => {
			state.loading = false;
			state.errorMessage = '';
			state.stages = action.payload;
		},
		[fetchDealsStages.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchDealsStages.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createDealsStage.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
			state.loading = false;
			state.errorMessage = '';
			state.stages.data = sortStagesWhenCreateNew(state.stages, action.payload);
		},
		[createDealsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createDealsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editDealsStage.fulfilled.type]: (state, action: PayloadAction<IStage>) => {
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
		[editDealsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editDealsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteDealsStage.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.stages.data = state.stages.data.filter((stage) => stage?.id !== action?.payload);
		},
		[deleteDealsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteDealsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchReasonsForDeals.fulfilled.type]: (state, action: PayloadAction<IReasons>) => {
			state.loading = false;
			state.errorMessage = '';
			state.reasons = action.payload;
		},
		[fetchReasonsForDeals.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchReasonsForDeals.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[createReasonsForDealsStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.reasonsLoading = false;
			state.errorMessage = '';
			state.reasons.FAIL.push(action.payload);
		},
		[createReasonsForDealsStage.pending.type]: (state) => {
			state.reasonsLoading = true;
			state.errorMessage = '';
		},
		[createReasonsForDealsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.reasonsLoading = false;
			state.errorMessage = action.payload;
		},
		[editReasonForDealsStage.fulfilled.type]: (state, action: PayloadAction<IReason>) => {
			state.loading = false;
			state.errorMessage = '';
			state.reasons.FAIL = state.reasons.FAIL.map((reason) => {
				if (reason?.id === action?.payload?.id) {
					return action.payload;
				}
				return reason;
			});
		},
		[editReasonForDealsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[editReasonForDealsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteReasonsForDealsStage.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.errorMessage = '';
			state.reasons.FAIL = state.reasons.FAIL.filter((reason) => reason?.id !== action?.payload);
		},
		[deleteReasonsForDealsStage.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[deleteReasonsForDealsStage.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { changeDealsColumnsState, changeDealsStagesSortState, changeSortingForDealsReasons, changeDealItem } = dealsStagesReducer.actions;
export default dealsStagesReducer.reducer;
