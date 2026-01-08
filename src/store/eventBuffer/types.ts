export interface IEvents {
	notifId: string;
	action: string;
	payload: any;
}

export interface IState {
	events: {
		[key: string]: {
			[key: string]: IEvents[];
		};
	};
}
