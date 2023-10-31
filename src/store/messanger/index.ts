import { combineReducers } from '@reduxjs/toolkit';

import messanger from './messanger';
import messangerExternal from './messangerExternal';

const messangerReducer = combineReducers({
	messanger,
	messangerExternal,
});

export default messangerReducer;
