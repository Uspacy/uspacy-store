import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDepartment } from '@uspacy/sdk/lib/models/department';

import { addUsersToDepartment, createDepartment, deleteDepartment, editDepartment, fetchDepartments, removeUsersFromDepartment } from './actions';
import { IState } from './types';

const initialState = {
	departments: [],
	loadingDepartments: true,
	errorLoadingDepartments: '',
} as IState;

const departmentsReducer = createSlice({
	name: 'departmentsReducer',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchDepartments.fulfilled.type]: (state, action: PayloadAction<IDepartment[]>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = '';
			state.departments = action.payload;
		},
		[fetchDepartments.pending.type]: (state) => {
			state.loadingDepartments = true;
			state.errorLoadingDepartments = '';
		},
		[fetchDepartments.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = action.payload;
		},
		[createDepartment.fulfilled.type]: (state, action: PayloadAction<IDepartment>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = '';
			state.departments = [...state.departments, action.payload];
			// DepartmentsCache.setData({
			// 	data: state.departments,
			// });
		},
		[createDepartment.pending.type]: (state) => {
			state.loadingDepartments = true;
			state.errorLoadingDepartments = '';
		},
		[createDepartment.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = action.payload;
		},
		[editDepartment.fulfilled.type]: (state, action: PayloadAction<IDepartment>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = '';
			state.departments = state.departments.map((department) => (department.id === action.payload.id ? action.payload : department));
			// DepartmentsCache.setData({
			// 	data: state.departments,
			// });
		},
		[editDepartment.pending.type]: (state) => {
			state.loadingDepartments = true;
			state.errorLoadingDepartments = '';
		},
		[editDepartment.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = action.payload;
		},
		[deleteDepartment.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = '';
			state.departments = state.departments.filter((department) => department.id.toString() !== action.payload.toString());
			// DepartmentsCache.setData({
			// 	data: state.departments,
			// });
		},
		[deleteDepartment.pending.type]: (state) => {
			state.loadingDepartments = true;
			state.errorLoadingDepartments = '';
		},
		[deleteDepartment.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = action.payload;
		},
		[addUsersToDepartment.fulfilled.type]: (state, action: PayloadAction<IDepartment>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = '';
			state.departments = state.departments.map((department) => (department.id === action.payload.id ? action.payload : department));
			// DepartmentsCache.setData({
			// 	data: state.departments,
			// });
		},
		[addUsersToDepartment.pending.type]: (state) => {
			state.loadingDepartments = true;
			state.errorLoadingDepartments = '';
		},
		[addUsersToDepartment.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = action.payload;
		},
		[removeUsersFromDepartment.fulfilled.type]: (state, action: PayloadAction<IDepartment>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = '';
			state.departments = state.departments.map((department) => (department.id === action.payload.id ? action.payload : department));
			// DepartmentsCache.setData({
			// 	data: state.departments,
			// });
		},
		[removeUsersFromDepartment.pending.type]: (state) => {
			state.loadingDepartments = true;
			state.errorLoadingDepartments = '';
		},
		[removeUsersFromDepartment.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingDepartments = false;
			state.errorLoadingDepartments = action.payload;
		},
	},
});

export default departmentsReducer.reducer;
