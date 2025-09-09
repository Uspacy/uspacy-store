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

export type TariffType = 'newsletter_10000' | 'newsletter_100000' | 'professional' | 'standard' | 'free';
export type DurationViewType = 'yearly' | 'monthly' | 'custom';
export type RadioValueTariffStateType = 'professional' | 'standard';
export type TypeOfPayerType = 'individual' | 'legalEntityIndividualEntrepreneur';
export type PaymentMethodType = 'card' | 'bank_transfer';
export type TariffActionType = 'extendTheTariff' | 'changeTheTariff';
export type DiscountInputType = 'input' | 'season';

export interface IState {
	isPaymentButtonPress: boolean;
	isPaymentProcess: boolean;
	price: IPrice;
	usersCount: number;
	newsletter_packs: number;
	durationView: DurationViewType;
	tariff: TariffType;
	radioValueTariffState: RadioValueTariffStateType;
	discountInput: IDiscounts;
	discountSeason: IDiscounts;
	typeOfPayer: TypeOfPayerType;
	paymentMethod: PaymentMethodType;
	tariffActionType: TariffActionType;
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
