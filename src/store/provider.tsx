import React from 'react';
import { Provider } from 'react-redux';

import { setupStore } from '.';

export const store = setupStore();

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};
