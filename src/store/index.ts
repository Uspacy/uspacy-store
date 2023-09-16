import { combineReducers, configureStore } from '@reduxjs/toolkit';

import departments from './departments';
import profile from './profile';
import tasks from './tasks';
import users from './users';

const rootReducer = combineReducers({
	departments,
	profile,
	tasks,
	users,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
