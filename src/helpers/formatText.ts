export const getSecondWordLowercase = (firstStaticWord: string, secWordForChange: string) => {
	const secondLowerWord = secWordForChange.slice(0, 1).toLowerCase() + secWordForChange.slice(1);
	return `${firstStaticWord} ${secondLowerWord}`;
};

export const formatNumber = (value: string): number => {
	return parseFloat(value.replace(/,/g, '.')) * 100;
};

export const unFormatNumber = (formattedNumber: number, currency = 'USD'): string => {
	const isUAH = currency === 'UAH';
	if (isUAH) return String((formattedNumber / 100).toFixed(2)).replace(/\./g, ',');
	return (formattedNumber / 100).toFixed(2);
};
