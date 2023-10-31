import { combineReducers } from '@reduxjs/toolkit';

import messenger from './messenger';
import messengerExternal from './messengerExternal';

const messengerReducer = combineReducers({
	messenger,
	messengerExternal,
});

export default messengerReducer;
