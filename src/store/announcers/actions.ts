import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IAdminUrlParams } from '@uspacy/sdk/lib/services/AnnouncersService/dto/announcers-dto';

export const fetchAnnouncers = createAsyncThunk(
	'announcers/fetchAnnouncers',
	async ({ populateParams, locale, apiPoint }: IAdminUrlParams, thunkAPI) => {
		try {
			const res = await uspacySdk.announcersService.getAnnouncers(populateParams, locale, apiPoint);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);
