import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IEvents, IState } from './types';

const initialState: IState = {
	events: {},
};

const eventBufferReducer = createSlice({
	name: 'eventBuffer',
	initialState,
	reducers: {
		addEvents(state: IState, action: PayloadAction<{ event: IEvents; eventEntity: string; entity: string; id: number }>) {
			const { entity, id, event, eventEntity } = action.payload;
			const eventId = `${entity}-${id}`;
			state.events = {
				...state.events,
				[eventEntity]: {
					...state?.events?.[eventEntity],
					[`${eventId}`]: [...(state?.events?.[eventEntity]?.[eventId] || []), event],
				},
			};
		},
		removeEventById(state: IState, action: PayloadAction<{ eventId: number; entityId: string | number; eventEntity: string }>) {
			const { entityId, eventId, eventEntity } = action.payload;
			state.events = {
				...state.events,
				[eventEntity]: {
					...state?.events?.[eventEntity],
					[`${eventId}`]: state.events?.[eventEntity]?.[eventId]?.filter((it) => it?.id !== entityId),
				},
			};
		},
		removeEventsByEventId(state: IState, action: PayloadAction<{ eventId: number; entityId: string; eventEntity: string }>) {
			const { eventId, eventEntity } = action.payload;
			state.events = {
				...state.events,
				[eventEntity]: {
					...state.events?.[eventEntity],
					[eventId]: [],
				},
			};
		},
	},
	extraReducers: {},
});

export const { addEvents, removeEventsByEventId, removeEventById } = eventBufferReducer.actions;

export default eventBufferReducer.reducer;
