import { combineReducers, configureStore } from '@reduxjs/toolkit';

import analytics from './analytics';
import announcers from './announcers';
import apps from './apps';
import auth from './auth';
import automations from './automations';
import calendars from './calendars';
import crm from './crm';
import crmCalls from './crmCalls';
import crmCompanies from './crmCompanies';
import crmContacts from './crmContacts';
import crmDeals from './crmDeals';
import dealsFunnel from './crmDealsFunnel';
import dealsStages from './crmDealsStages';
import crmDocumentTemplates from './crmDocumentTemplates';
import crmEntities from './crmEntities';
import crmLeads from './crmLeads';
import leadsFunnel from './crmLeadsFunnel';
import leadsStages from './crmLeadsStages';
import crmProducts from './crmProducts';
import crmProductsCategory from './crmProductsCategory';
import crmProductsForEntity from './crmProductsForEntity';
import crmProductsTaxes from './crmProductsTaxes';
import crmProductsUnit from './crmProductsUnit';
import crmRequisite from './crmRequisite';
import crmTasks from './crmTasks';
import departments from './departments';
import drawersManagement from './drawersManagement';
import email from './email';
import files from './files';
import forms from './forms';
import groups from './groups';
import history from './history';
import messengerReducer from './messenger';
import migrationsReducer from './migrations';
import newsfeed from './newsfeed';
import notifications from './notifications';
import payments from './payments';
import profile from './profile';
import roles from './roles';
import settings from './settings';
import tasks from './tasks';
import tasksFilters from './tasksFilters';
import tasksSettings from './tasksSettings';
import tasksStages from './tasksStages';
import tasksTimer from './tasksTimer';
import users from './users';
import webhooks from './webhooks';

const rootReducer = combineReducers({
	apps,
	auth,
	dealsFunnel,
	leadsFunnel,
	dealsStages,
	leadsStages,
	departments,
	email,
	files,
	groups,
	notifications,
	payments,
	profile,
	roles,
	tasks,
	tasksFilters,
	tasksSettings,
	tasksStages,
	tasksTimer,
	users,
	webhooks,
	newsfeed,
	migrationsReducer,
	messengerReducer,
	automations,
	drawersManagement,
	crmEntities,
	crmCalls,
	crmCompanies,
	crmContacts,
	crmDeals,
	crmLeads,
	crmTasks,
	crmProducts,
	crmProductsCategory,
	crmProductsForEntity,
	crmProductsTaxes,
	crmProductsUnit,
	crmDocumentTemplates,
	crmRequisite,
	history,
	settings,
	announcers,
	crm,
	calendars,
	analytics,
	forms,
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: false,
			}),
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
