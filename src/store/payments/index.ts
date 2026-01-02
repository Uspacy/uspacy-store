import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
	DiscountInputType,
	DurationViewType,
	IDiscounts,
	IIndividualPersonForm,
	IIndividualPersonFormErrors,
	IIndividualPersonFormErrorsEu,
	IIndividualPersonFormEu,
	ILegalForm,
	ILegalFormErrors,
	ILegalFormErrorsEu,
	ILegalFormEu,
	IPrice,
	IState,
	PaymentMethodType,
	RadioValueTariffStateType,
	TariffActionType,
	TariffType,
	TypeOfPayerType,
} from './types';

const initialState = {
	isPaymentButtonPress: false,
	isPaymentProcess: false,
	price: {
		professional: 1,
		standard: 1,
		email_credits_10k: 1,
		email_credits_100k: 1,
	},
	usersCount: 0,
	emailCreditsCount: 0,
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
	typeOfPayer: 'legalEntityIndividualEntrepreneur',
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
	legalForm: {
		contactPersonPhone: '',
		contactPersonEmail: '',
		itinCode: '',
	},
	individualPersonFormEu: {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		country: '',
	},
	legalFormEu: {
		email: '',
		phone: '',
		registryCode: '',
		vatNumber: '',
		companyName: '',
		country: '',
	},
	individualPersonFormErrors: {
		firstNameErr: false,
		lastNameErr: false,
		phoneErr: false,
		emailErr: false,
	},
	legalFormErrors: {
		contactPersonPhoneErr: false,
		contactPersonEmailErr: false,
		itinCodeErr: false,
	},
	individualPersonFormErrorsEu: {
		firstNameErr: false,
		lastNameErr: false,
		emailErr: false,
		phoneErr: false,
		countryErr: false,
	},
	legalFormErrorsEu: {
		emailErr: false,
		phoneErr: false,
		registryCodeErr: false,
		vatNumberErr: false,
		companyNameErr: false,
		countryErr: false,
	},
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
		setEmailCreditsCount: (state, action: PayloadAction<number>) => {
			state.emailCreditsCount = action.payload;
		},
		setDurationView: (state, action: PayloadAction<DurationViewType>) => {
			state.durationView = action.payload;
		},
		setTariff: (state, action: PayloadAction<TariffType>) => {
			state.tariff = action.payload;
		},
		setRadioValueTariffState: (state, action: PayloadAction<RadioValueTariffStateType>) => {
			state.radioValueTariffState = action.payload;
		},
		setDiscounts: (state, action: PayloadAction<{ discount: IDiscounts; type: DiscountInputType }>) => {
			if (action.payload.type === 'input') {
				state.discountInput = action.payload.discount;
			}
			if (action.payload.type === 'season') {
				state.discountSeason = action.payload.discount;
			}
		},
		setTypeOfPayer: (state, action: PayloadAction<TypeOfPayerType>) => {
			state.typeOfPayer = action.payload;
		},
		setPaymentMethod: (state, action: PayloadAction<PaymentMethodType>) => {
			state.paymentMethod = action.payload;
		},
		setTariffActionType: (state, action: PayloadAction<TariffActionType>) => {
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
		setLegalForm: (state, action: PayloadAction<ILegalForm>) => {
			state.legalForm = action.payload;
		},
		setIndividualPersonFormEu: (state, action: PayloadAction<IIndividualPersonFormEu>) => {
			state.individualPersonFormEu = action.payload;
		},
		setLegalFormEu: (state, action: PayloadAction<ILegalFormEu>) => {
			state.legalFormEu = action.payload;
		},
		setIndividualPersonFormErrors: (state, action: PayloadAction<IIndividualPersonFormErrors>) => {
			state.individualPersonFormErrors = action.payload;
		},
		setLegalFormErrors: (state, action: PayloadAction<ILegalFormErrors>) => {
			state.legalFormErrors = action.payload;
		},
		setIndividualPersonFormErrorsEu: (state, action: PayloadAction<IIndividualPersonFormErrorsEu>) => {
			state.individualPersonFormErrorsEu = action.payload;
		},
		setLegalFormErrorsEu: (state, action: PayloadAction<ILegalFormErrorsEu>) => {
			state.legalFormErrorsEu = action.payload;
		},
	},
	extraReducers: {},
});

export const {
	setIsPaymentButtonPress,
	setIsPaymentProcess,
	setPrice,
	setUsersCount,
	setEmailCreditsCount,
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
	setLegalForm,
	setIndividualPersonFormEu,
	setLegalFormEu,
	setIndividualPersonFormErrors,
	setLegalFormErrors,
	setIndividualPersonFormErrorsEu,
	setLegalFormErrorsEu,
} = paymentsReducer.actions;
export default paymentsReducer.reducer;
