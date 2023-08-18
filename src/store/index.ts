import { combineReducers, configureStore } from '@reduxjs/toolkit';

import departments from './departments';
import profile from './profile';
import users from './users';

const rootReducer = combineReducers({
	departments,
	profile,
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
