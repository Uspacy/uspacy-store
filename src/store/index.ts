import { combineReducers, configureStore } from '@reduxjs/toolkit';

import apps from './apps';
import auth from './auth';
import comments from './comments';
import crmEntities from './crmEntities';
import dealsFunnel from './dealsFunnel';
import departments from './departments';
import files from './files';
import groups from './groups';
import messanger from './messanger';
import messangerExternal from './messangerExternal';
import migrationsReducer from './migrations';
import newsfeed from './newsfeed';
import notifications from './notifications';
import payments from './payments';
import profile from './profile';
import roles from './roles';
import tasks from './tasks';
import tasksFilters from './tasksFilters';
import tasksStages from './tasksStages';
import tasksTimer from './tasksTimer';
import users from './users';
import webhooks from './webhooks';

const rootReducer = combineReducers({
	apps,
	auth,
	comments,
	crmEntities,
	dealsFunnel,
	departments,
	files,
	groups,
	notifications,
	payments,
	profile,
	roles,
	tasks,
	tasksFilters,
	tasksStages,
	tasksTimer,
	users,
	webhooks,
	newsfeed,
	migrationsReducer,
	messanger,
	messangerExternal,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
