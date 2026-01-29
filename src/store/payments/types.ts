export interface IPrice {
	[key: string]: number;
}

export interface IDiscounts {
	type: 'percentage' | 'amount';
	value: number;
}

export interface IIndividualPersonForm {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
}

export interface ILegalForm {
	contactPersonPhone: string;
	contactPersonEmail: string;
	itinCode: string;
	edoEmail: string;
}

export interface IIndividualPersonFormEu {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	country: string;
}

export interface ILegalFormEu {
	email?: string;
	phone?: string;
	registryCode: string;
	companyName: string;
	country: string;
	vatNumber?: string;
}

export interface IIndividualPersonFormErrors {
	firstNameErr: boolean;
	lastNameErr: boolean;
	phoneErr: boolean;
	emailErr: boolean;
}

export interface ILegalFormErrors {
	contactPersonPhoneErr: boolean;
	contactPersonEmailErr: boolean;
	itinCodeErr: boolean;
	edoEmailErr: boolean;
}

export interface IIndividualPersonFormErrorsEu {
	firstNameErr: boolean;
	lastNameErr: boolean;
	emailErr: boolean;
	phoneErr: boolean;
	countryErr: boolean;
}

export interface ILegalFormErrorsEu {
	emailErr?: boolean;
	phoneErr?: boolean;
	registryCodeErr: boolean;
	companyNameErr: boolean;
	countryErr: boolean;
	vatNumberErr?: boolean;
}

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
	legalForm: ILegalForm;
	individualPersonFormEu: IIndividualPersonFormEu;
	legalFormEu: ILegalFormEu;
	individualPersonFormErrors: IIndividualPersonFormErrors;
	legalFormErrors: ILegalFormErrors;
	individualPersonFormErrorsEu: IIndividualPersonFormErrorsEu;
	legalFormErrorsEu: ILegalFormErrorsEu;
}
