import isEqual from 'lodash/isEqual';
import { useRef } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useMemoizedAppSelector = <T>(selector: (state: RootState) => T) => {
	const dataRef = useRef<T>();
	return useAppSelector((state) => {
		const data = selector(state);
		if (isEqual(dataRef.current, data)) {
			return dataRef.current;
		}
		dataRef.current = data;
		return data;
	});
};
