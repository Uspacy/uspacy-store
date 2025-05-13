/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct, IProducts } from '@uspacy/sdk/lib/models/crm-products';
import { IField, IFields } from '@uspacy/sdk/lib/models/field';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

import { defaultProductFieldKeys } from './../const';
import { formatNumber, unFormatNumber } from './formatText';

const defaultValue = {
	productType: [
		{ title: 'goods', value: 'goods', color: '', sort: 0, selected: true },
		{ title: 'service', value: 'service', color: '', sort: 0, selected: false },
	],
	productAvailability: [
		{ title: 'true', value: 'true', color: '#93DD5C', sort: 0, selected: true },
		{ title: 'false', value: 'false', color: '#FF8C90', sort: 0, selected: false },
		{ title: 'await', value: 'await', color: '#FFCF5C', sort: 0, selected: false },
	],
};

export const normalizeProduct = (product: Omit<IProduct, 'id'>) => {
	const sendCategoryCondition = product?.product_category_id || product?.product_category_id === 0;
	const productCategory = { product_category_id: product.product_category_id || null };
	const productDescription = { description: isArray(product?.description) && !product?.description[0] ? null : product?.description };
	const productQuantity = product.remainder ? +product.remainder : undefined;
	const productPreview = !isObject(product.preview_image_id) ? product.preview_image_id : undefined;

	const additionalFields = Object.entries(product).reduce((acc, [key, value]) => {
		if (!defaultProductFieldKeys.includes(key)) return { ...acc, [key]: value };
		return acc;
	}, {});

	const resetProductFields = Object.keys(additionalFields).reduce((acc, key) => ({ ...acc, [key]: undefined }), {});

	const formattedProduct = {
		...product,
		...(sendCategoryCondition && productCategory),
		...(product?.description && productDescription),
		quantity: productQuantity,
		preview_image_id: productPreview,
		additional: isEmpty(additionalFields) ? undefined : additionalFields,
		// for clean req
		...resetProductFields,
	};
	if (!product?.prices) return formattedProduct;
	const getNewPrices = () => {
		return product?.prices
			?.filter((priceContainer) => priceContainer.price !== null)
			.map((priceContainer) => {
				return {
					...priceContainer,
					price: !!!priceContainer.price ? formatNumber('0') : formatNumber(String(priceContainer.price)),
					is_tax_included: priceContainer.is_tax_included ? 1 : 0,
				};
			});
	};

	const priceResult = getNewPrices();
	return { ...formattedProduct, prices: priceResult?.length ? priceResult : undefined };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeProductForView = (product: Omit<IProduct, 'prices'> & { additional: any; prices: { price: number; currency: string }[] }) => {
	const productImage = product.files.find((file) => file.id === product.preview_image_id);
	const formattedProduct = {
		...product,
		...product.additional,
		remainder: product.quantity,
		preview_image_id: productImage ? [productImage] : null,
	};
	if (!product?.prices) return formattedProduct;
	const getNewPrices = () =>
		product?.prices?.map((priceContainer) => {
			return { ...priceContainer, price: !!!priceContainer.price ? 0 : unFormatNumber(priceContainer.price, priceContainer.currency) };
		});
	return { ...product, ...formattedProduct, prices: getNewPrices() };
};

export const normalizeGetProducts = (data: IProducts): IProducts => {
	// @ts-ignore
	const newData = data.data.map((product) => normalizeProductForView(product));
	return { ...data, data: newData as IProduct[] };
};

export const normalizeProducts = (data: IProduct[]) => {
	// @ts-ignore
	return data.map(normalizeProductForView);
};
export const normalizeCategories = (categoriesIds?: number) => {
	if (categoriesIds === 0) return undefined;
	if (categoriesIds === 0.1) return null;
	return ((isArray(categoriesIds) ? categoriesIds : [categoriesIds]) as any).filter((it) => it !== 0);
};

export const normalizeProductField = (resField, defaultFields) => {
	const connectedField = defaultFields.find((defField) => resField.code === defField.code);
	const galleryField = connectedField?.code === 'files';
	if (connectedField) return { ...connectedField, code: galleryField ? 'preview_image_id' : connectedField.code, name: resField.name };
	return resField;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeProductFields = (productFields: IFields, defaultFields: any[]) => {
	// NEED: for upload preview image
	const fileUploadField = { ...defaultFields[0], name: 'preview_image_upload', hidden: true, code: 'file_ids', multiple: true };
	const connectedFields = productFields.data.map((resField) => normalizeProductField(resField, defaultFields));
	return [...connectedFields, fileUploadField];
};

export const normalizeSettingField = (field) => {
	if (field.code === 'preview_image_id') return { ...field, code: 'files' };
	return field;
};

export const normalizeMockFieldValue = (field) => ({ ...field, values: defaultValue[field.type] || [] });

const defColumn: IField = {
	name: '',
	code: '',
	required: false,
	editable: true,
	show: true,
	hidden: false,
	multiple: false,
	type: 'string',
	system_field: true,
	base_field: true,
};

export const defaultDataColumns = [
	{ ...defColumn, name: 'product/service', code: 'title', type: 'productTitle', required: true },
	{ ...defColumn, name: 'category', code: 'product_category_id', type: 'productCategory' },
	{ ...defColumn, name: 'productType', code: 'type', type: 'productType' },
	{ ...defColumn, name: 'article', code: 'article', type: 'productArticle' },
	{ ...defColumn, name: 'price', code: 'prices', type: 'productPrice', multiple: true },
	{ ...defColumn, name: 'unit', code: 'measurement_unit_id', type: 'productUnit' },
	{ ...defColumn, name: 'availability', code: 'availability', type: 'productAvailability' },
	{ ...defColumn, name: 'remainder', code: 'remainder', type: 'productRemind' },
	{ ...defColumn, name: 'description', code: 'description', type: 'textarea' },
	{ ...defColumn, name: 'tax', code: 'tax', type: 'productTax' },
	{ ...defColumn, name: 'activityProductFilter', code: 'is_active', type: 'productActivity' },
	{ ...defColumn, name: 'productGallery', code: 'files', type: 'productGallery' },
	{ ...defColumn, name: 'productLink', code: 'link', type: 'productLink' },
	{ ...defColumn, name: 'commentProduct', code: 'comment', type: 'textarea' },
	{ ...defColumn, name: 'currency', code: 'currency', type: 'label' },
];
