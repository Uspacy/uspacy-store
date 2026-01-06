export interface IEvents {
	id: number;
	action: string;
	payload: any;
	ts: number;
}

export interface IState {
	events: {
		[key: string]: {
			[key: string]: IEvents[];
		};
	};
}
