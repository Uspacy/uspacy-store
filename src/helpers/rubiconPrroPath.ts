export const RUBICON_PRRO_SERVICE = 'u-prro';
export const RUBICON_PRRO_BASE_PATH = '/u-prro';

export const buildRubiconPrroLink = (entityCode: string, entityId: string | number, mode?: string) =>
	`${RUBICON_PRRO_BASE_PATH}/${entityCode}-${entityId}${mode === 'create' ? '/create' : ''}`;

export const getRubiconPrroDrawerId = (entityCode: string, entityId: string | number) => `${RUBICON_PRRO_SERVICE}-${entityCode}-${entityId}`;
