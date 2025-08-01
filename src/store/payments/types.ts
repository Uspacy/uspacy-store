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

export interface ICheckCardFill {
	error: boolean;
	complete: boolean;
}

export interface IState {
	isPaymentButtonPress: boolean;
	isPaymentProcess: boolean;
	price: IPrice;
	usersCount: number;
	durationView: 'yearly' | 'monthly';
	tariff: 'professional' | 'standard' | 'free';
	radioValueTariffState: 'professional' | 'standard';
	discountInput: IDiscounts;
	discountSeason: IDiscounts;
	typeOfPayer: 'individual' | 'legalEntityIndividualEntrepreneur';
	paymentMethod: 'card' | 'bank_transfer';
	tariffActionType: 'extendTheTariff' | 'changeTheTariff';
	vatTaxStatus: string;
	automaticSubscriptionRenewal: boolean;
	individualPersonForm: IIndividualPersonForm;
	legalEntityForm: ILegalEntityForm;
	legalEntityFormEuCom: ILegalEntityFormEuCom;
	individualPersonFormErrors: IIndividualPersonFormErrors;
	legalEntityFormErrors: ILegalEntityFormErrors;
	legalEntityFormEuComErrors: ILegalEntityFormEuComErrors;
	vatTaxIdError: boolean;
}
