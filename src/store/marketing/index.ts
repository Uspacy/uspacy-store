import { combineReducers } from '@reduxjs/toolkit';

import domains from './domains';
import filters from './filters';
import newsletters from './newsletters';
import senders from './senders';
import templates from './templates';

const marketing = combineReducers({
	templates,
	newsletters,
	senders,
	domains,
	filters,
});

export default marketing;
