import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IEvents, IState } from './types';

const initialState: IState = {
	events: {},
};

const eventBufferReducer = createSlice({
	name: 'eventBuffer',
	initialState,
	reducers: {
		addEvents(state: IState, action: PayloadAction<{ event: IEvents; eventEntity: string; eventIdKey: string }>) {
			const { eventIdKey, event, eventEntity } = action.payload;
			state.events = {
				...state.events,
				[eventEntity]: {
					...state?.events?.[eventEntity],
					[`${eventIdKey}`]: [...(state?.events?.[eventEntity]?.[eventIdKey] || []), event],
				},
			};
		},
		removeEventById(state: IState, action: PayloadAction<{ eventIdKey: string; notifId: string; eventEntity: string }>) {
			const { notifId, eventIdKey, eventEntity } = action.payload;
			state.events = {
				...state.events,
				[eventEntity]: {
					...state?.events?.[eventEntity],
					[`${eventIdKey}`]: state.events?.[eventEntity]?.[eventIdKey]?.filter((it) => it?.notifId !== notifId),
				},
			};
		},
		removeEventByEntityKey(state: IState, action: PayloadAction<{ eventEntityKey: string; eventEntity: string }>) {
			const { eventEntityKey, eventEntity } = action.payload;
			const prevEntityEvents = state.events?.[eventEntity] ?? {};

			state.events = {
				...state.events,
				[eventEntity]: Object.fromEntries(Object.entries(prevEntityEvents).filter(([key]) => !key.startsWith(eventEntityKey))),
			};
		},
		removeEventsByEventId(state: IState, action: PayloadAction<{ eventIdKey: string; eventEntity: string }>) {
			const { eventIdKey, eventEntity } = action.payload;
			state.events = {
				...state.events,
				[eventEntity]: {
					...state.events?.[eventEntity],
					[eventIdKey]: [],
				},
			};
		},
	},
	extraReducers: {},
});

export const { addEvents, removeEventsByEventId, removeEventById, removeEventByEntityKey } = eventBufferReducer.actions;

export const consumeEvents = (eventIdKey: string, eventEntity: string) => (dispatch, getState) => {
	const state = getState();
	const events = state.eventBuffer.events?.[eventEntity]?.[eventIdKey] || [];

	dispatch(
		removeEventsByEventId({
			eventEntity,
			eventIdKey,
		}),
	);

	return events;
};

export default eventBufferReducer.reducer;
