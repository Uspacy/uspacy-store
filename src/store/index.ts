import { combineReducers, configureStore } from '@reduxjs/toolkit';

import auth from './auth';
import comments from './comments';
import dealsFunnel from './dealsFunnel';
import departments from './departments';
import files from './files';
import groups from './groups';
import notifications from './notifications';
import payments from './payments';
import profile from './profile';
import roles from './roles';
import tasks from './tasks';
import tasksStages from './tasksStages';
import tasksTimer from './tasksTimer';
import users from './users';
import webhooks from './webhooks';

const rootReducer = combineReducers({
	auth,
	comments,
	dealsFunnel,
	departments,
	files,
	groups,
	notifications,
	payments,
	profile,
	roles,
	tasks,
	tasksStages,
	tasksTimer,
	users,
	webhooks,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
