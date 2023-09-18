import { combineReducers, configureStore } from '@reduxjs/toolkit';

import comments from './comments';
import departments from './departments';
import files from './files';
import groups from './groups';
import profile from './profile';
import tasks from './tasks';
import tasksStages from './tasksStages';
import tasksTimer from './tasksTimer';
import users from './users';

const rootReducer = combineReducers({
	comments,
	departments,
	files,
	groups,
	profile,
	tasks,
	tasksStages,
	tasksTimer,
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
