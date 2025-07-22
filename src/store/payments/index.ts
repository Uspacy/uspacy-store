import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IDiscounts,
	IIndividualPersonForm,
	IIndividualPersonFormErrors,
	ILegalEntityForm,
	ILegalEntityFormErrors,
	ILegalEntityFormEuCom,
	ILegalEntityFormEuComErrors,
	IPrice,
} from '@uspacy/sdk/lib/models/payments';

import { IState } from './types';

const initialState = {
	isPaymentButtonPress: false,
	isPaymentProcess: false,
	price: {
		professional: 1,
		standard: 1,
	},
	usersCount: 0,
	durationView: 'yearly',
	tariff: 'professional',
	radioValueTariffState: 'professional',
	discountInput: {
		type: 'percentage',
		value: 0,
	},
	discountSeason: {
		type: 'percentage',
		value: 0,
	},
	typeOfPayer: 'individual',
	paymentMethod: 'card',
	tariffActionType: 'changeTheTariff',
	vatTaxStatus: '',
	automaticSubscriptionRenewal: false,
	individualPersonForm: {
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
	},
	legalEntityForm: {
		contactPersonPhone: '',
		contactPersonEmail: '',
		itinCode: '',
		companyName: '',
		legalAddress: '',
		directorsFullName: '',
		token: '',
	},
	legalEntityFormEuCom: {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
	},
	individualPersonFormErrors: {
		firstNameErr: false,
		lastNameErr: false,
		phoneErr: false,
		emailErr: false,
	},
	legalEntityFormErrors: {
		contactPersonPhoneErr: false,
		contactPersonEmailErr: false,
		itinCodeErr: false,
	},
	legalEntityFormEuComErrors: {
		firstNameErr: false,
		lastNameErr: false,
		emailErr: false,
		phoneErr: false,
	},
	vatTaxIdError: false,
} as IState;

const paymentsReducer = createSlice({
	name: 'paymentsReducer',
	initialState,
	reducers: {
		setIsPaymentButtonPress: (state, action: PayloadAction<boolean>) => {
			state.isPaymentButtonPress = action.payload;
		},
		setIsPaymentProcess: (state, action: PayloadAction<boolean>) => {
			state.isPaymentProcess = action.payload;
		},
		setPrice: (state, action: PayloadAction<IPrice>) => {
			state.price = action.payload;
		},
		setUsersCount: (state, action: PayloadAction<number>) => {
			state.usersCount = action.payload;
		},
		setDurationView: (state, action: PayloadAction<'yearly' | 'monthly'>) => {
			state.durationView = action.payload;
		},
		setTariff: (state, action: PayloadAction<'professional' | 'standard'>) => {
			state.tariff = action.payload;
		},
		setRadioValueTariffState: (state, action: PayloadAction<'professional' | 'standard'>) => {
			state.radioValueTariffState = action.payload;
		},
		setDiscounts: (state, action: PayloadAction<{ discount: IDiscounts; type: 'input' | 'season' }>) => {
			if (action.payload.type === 'input') {
				state.discountInput = action.payload.discount;
			}
			if (action.payload.type === 'season') {
				state.discountSeason = action.payload.discount;
			}
		},
		setTypeOfPayer: (state, action: PayloadAction<'individual' | 'legalEntityIndividualEntrepreneur'>) => {
			state.typeOfPayer = action.payload;
		},
		setPaymentMethod: (state, action: PayloadAction<'card' | 'bank_transfer'>) => {
			state.paymentMethod = action.payload;
		},
		setTariffActionType: (state, action: PayloadAction<'extendTheTariff' | 'changeTheTariff'>) => {
			state.tariffActionType = action.payload;
		},
		setVatTaxStatus: (state, action: PayloadAction<string>) => {
			state.vatTaxStatus = action.payload;
		},
		setAutomaticSubscriptionRenewal: (state, action: PayloadAction<boolean>) => {
			state.automaticSubscriptionRenewal = action.payload;
		},
		setIndividualPersonForm: (state, action: PayloadAction<IIndividualPersonForm>) => {
			state.individualPersonForm = action.payload;
		},
		setIndividualPersonFormErrors: (state, action: PayloadAction<IIndividualPersonFormErrors>) => {
			state.individualPersonFormErrors = action.payload;
		},
		setLegalEntityForm: (state, action: PayloadAction<ILegalEntityForm>) => {
			state.legalEntityForm = action.payload;
		},
		setLegalEntityFormErrors: (state, action: PayloadAction<ILegalEntityFormErrors>) => {
			state.legalEntityFormErrors = action.payload;
		},
		setLegalEntityFormEuCom: (state, action: PayloadAction<ILegalEntityFormEuCom>) => {
			state.legalEntityFormEuCom = action.payload;
		},
		setLegalEntityFormEuComErrors: (state, action: PayloadAction<ILegalEntityFormEuComErrors>) => {
			state.legalEntityFormEuComErrors = action.payload;
		},
		setVatTaxIdError: (state, action: PayloadAction<boolean>) => {
			state.vatTaxIdError = action.payload;
		},
	},
	extraReducers: {},
});

export const {
	setIsPaymentButtonPress,
	setIsPaymentProcess,
	setPrice,
	setUsersCount,
	setDurationView,
	setTariff,
	setRadioValueTariffState,
	setDiscounts,
	setTypeOfPayer,
	setPaymentMethod,
	setTariffActionType,
	setVatTaxStatus,
	setAutomaticSubscriptionRenewal,
	setIndividualPersonForm,
	setIndividualPersonFormErrors,
	setLegalEntityForm,
	setLegalEntityFormErrors,
	setLegalEntityFormEuCom,
	setLegalEntityFormEuComErrors,
	setVatTaxIdError,
} = paymentsReducer.actions;
export default paymentsReducer.reducer;
