import { combineReducers } from '@reduxjs/toolkit';

import amo from './amo';
import bitrix24 from './bitrix24';
import dataPresence from './dataPresence';
import progress from './progress';
import allSystems from './progress/getAllSystemsStatus';
import stopImport from './stopImport';
import systemWithKey from './systemsWithKey';

const migrationsReducer = combineReducers({
	amo,
	bitrix24,
	dataPresence,
	progress,
	allSystems,
	stopImport,
	systemWithKey,
});

export default migrationsReducer;
