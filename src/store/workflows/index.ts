import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IWorkflow, IWorkflowFilter, IWorkflowsResponse } from '@uspacy/sdk/lib/models/workflows';

import { deleteWorkflow, fetchWorkflows, toggleWorkflow } from './actions';
import { IState } from './types';

const initialState = {
	workflows: {
		data: [],
		meta: {},
	},
	filter: {
		page: 1,
		list: 20,
		q: '',
		sortModel: [],
	},
	workflow: {},
	loadingWorkflows: false,
	errorLoadingWorkflows: null,
} as IState;

const workflowReducer = createSlice({
	name: 'workflows',
	initialState,
	reducers: {
		updateWorkflows: (state, action: PayloadAction<IWorkflowsResponse>) => {
			state.workflows = action.payload;
		},
		addWorkflowToEndTable: (state, action: PayloadAction<IWorkflow>) => {
			state.workflows.data.push(action.payload);
		},
		toggleActiveWorkflow: (state, action: PayloadAction<number>) => {
			state.workflows.data = state.workflows.data.map((it) => (it.portal_id === action.payload ? { ...it, active: !it.active } : it));
		},
		addWorkflowToStartTable: (state, action: PayloadAction<IWorkflow>) => {
			state.workflows.data = [action.payload, ...state.workflows.data];
			state.workflows.meta.total = state.workflows.meta.total + 1;
		},
		clearItems: (state) => {
			state.workflows = initialState.workflows;
		},
		clearItemsWithLoader: (state) => {
			state.workflows = initialState.workflows;
			state.loadingWorkflows = true;
		},
		clearFilter: (state) => {
			state.filter = { ...initialState.filter, sortModel: state?.filter?.sortModel || [] };
		},
		changeFilter: (state, action: PayloadAction<IWorkflowFilter>) => {
			state.filter = action.payload;
		},
	},
	extraReducers: {
		[fetchWorkflows.fulfilled.type]: (state, action: PayloadAction<IWorkflowsResponse>) => {
			state.loadingWorkflows = false;
			state.errorLoadingWorkflows = null;
			state.workflows.data = action.payload.data || [];
			state.workflows.meta = action.payload.meta;
		},
		[fetchWorkflows.pending.type]: (state) => {
			state.loadingWorkflows = true;
			state.errorLoadingWorkflows = null;
		},
		[fetchWorkflows.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWorkflows = false;
			state.errorLoadingWorkflows = action.payload;
		},
		[deleteWorkflow.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingWorkflows = false;
			state.errorLoadingWorkflows = null;
			state.workflows.data = state.workflows.data.filter((el) => el.portal_id !== action.payload);
			state.workflows.meta.total = state.workflows.meta.total - 1;
		},
		[deleteWorkflow.pending.type]: (state) => {
			state.loadingWorkflows = true;
			state.errorLoadingWorkflows = null;
		},
		[deleteWorkflow.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWorkflows = false;
			state.errorLoadingWorkflows = action.payload;
		},
		[toggleWorkflow.fulfilled.type]: (state) => {
			state.loadingWorkflows = false;
			state.errorLoadingWorkflows = null;
		},
		[toggleWorkflow.pending.type]: (state) => {
			state.loadingWorkflows = true;
			state.errorLoadingWorkflows = null;
		},
		[toggleWorkflow.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingWorkflows = false;
			state.errorLoadingWorkflows = action.payload;
		},
	},
});

export const {
	addWorkflowToEndTable,
	toggleActiveWorkflow,
	addWorkflowToStartTable,
	clearFilter,
	changeFilter,
	clearItems,
	clearItemsWithLoader,
	updateWorkflows,
} = workflowReducer.actions;
export default workflowReducer.reducer;
