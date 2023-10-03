export const fillTheString = (text: string, payloadString: string, settings: 'before' | 'after') => {
	if (settings === 'before') return payloadString + text;
	if (settings === 'after') return text + payloadString;
	else return text;
};
