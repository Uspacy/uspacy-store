import { combineReducers } from '@reduxjs/toolkit';

import cardBlocks from './cardBlocks';
import categories from './categories';
import entities from './entities';
import fields from './fields';
import filters from './filters';
import funnels from './funnels';
import items from './items';
import taxes from './taxes';
import units from './units';

const crm = combineReducers({
	cardBlocks,
	categories,
	entities,
	fields,
	filters,
	funnels,
	items,
	taxes,
	units,
});

export default crm;
