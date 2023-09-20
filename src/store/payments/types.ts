import {
	ICardCheck,
	IDiscounts,
	IIndividualPersonForm,
	IIndividualPersonFormErrors,
	ILegalEntityForm,
	ILegalEntityFormErrors,
	ILegalEntityFormEuCom,
	ILegalEntityFormEuComErrors,
	IPrice,
} from '@uspacy/sdk/lib/models/payments';

export interface IState {
	cardCheck: ICardCheck;
	checkFillCardNumber: {
		error: boolean;
		complete: boolean;
	};
	checkFillCardExpiry: {
		error: boolean;
		complete: boolean;
	};
	checkFillCardCvv: {
		error: boolean;
		complete: boolean;
	};
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
	cardToken: string;
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
