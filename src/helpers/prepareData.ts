import { IBooking } from '@uspacy/sdk/lib/models/booking';
import { IResource } from '@uspacy/sdk/lib/models/resources';

export const prepareBookingInToResources = (booking: IBooking): IResource => {
	const { name, ...otherGeneral } = booking.general;
	const { entity: crmEntity, fields, ...otherUserData } = booking.userData;
	const { additionalRestrictions, meetHours } = booking;
	return {
		name,
		type: 'calendar',
		config: {
			crmEntity,
			fields,
			other: [
				{
					key: 'general',
					value: {
						...otherGeneral,
					},
				},
				{
					key: 'userData',
					value: {
						...otherUserData,
					},
				},
				{
					key: 'additionalRestrictions',
					value: additionalRestrictions,
				},
				{
					key: 'meetHours',
					value: meetHours,
				},
			],
		},
	};
};

export const prepareResourceInToBooking = (resource: IResource): IBooking => {
	const { name, config, id, entryPoint, active } = resource;
	const { crmEntity, fields } = config;
	const otherUserData = config.other?.find((it) => it.key === 'userData')?.value || {};
	const { ...otherGeneral } = config.other?.find((it) => it.key === 'general')?.value || {};
	const additionalRestrictions = config.other?.find((it) => it.key === 'additionalRestrictions')?.value || [];
	const meetHours = config.other?.find((it) => it.key === 'meetHours')?.value || [];

	return {
		id,
		entryPoint,
		active,
		general: {
			name,
			...otherGeneral,
		},
		userData: {
			entity: crmEntity,
			fields,
			...otherUserData,
		},
		additionalRestrictions,
		meetHours,
	};
};
