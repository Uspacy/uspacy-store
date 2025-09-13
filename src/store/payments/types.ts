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

export type TariffType = 'email_credits_10k' | 'email_credits_100k' | 'professional' | 'standard' | 'free';
export type DurationViewType = 'yearly' | 'monthly' | 'emailCredits';
export type RadioValueTariffStateType = 'email_credits_10k' | 'email_credits_100k' | 'professional' | 'standard';
export type TypeOfPayerType = 'individual' | 'legalEntityIndividualEntrepreneur';
export type PaymentMethodType = 'card' | 'bank_transfer';
export type TariffActionType = 'extendTheTariff' | 'changeTheTariff' | 'emailCredits';
export type DiscountInputType = 'input' | 'season';

export interface IState {
	isPaymentButtonPress: boolean;
	isPaymentProcess: boolean;
	price: IPrice;
	usersCount: number;
	emailCreditsCount: number;
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
