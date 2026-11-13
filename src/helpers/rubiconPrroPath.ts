// Cards of the Rubicon PRRO app open in the multi drawers and are addressable by url:
//   /u-prro/<entityCode>-<entityId>/create — create (e.g. fiscalize leads #2999: /u-prro/leads-2999/create)
//   /u-prro/<entityCode>-<entityId>        — view (e.g. receipt #555: /u-prro/receipts-555)
// entityId is a number or a uuid.
export const RUBICON_PRRO_SERVICE = 'u-prro';
export const RUBICON_PRRO_BASE_PATH = '/u-prro';

export const buildRubiconPrroLink = (entityCode: string, entityId: string | number, mode?: string) =>
	`${RUBICON_PRRO_BASE_PATH}/${entityCode}-${entityId}${mode === 'create' ? '/create' : ''}`;

export const getRubiconPrroDrawerId = (entityCode: string, entityId: string | number) => `${RUBICON_PRRO_SERVICE}-${entityCode}-${entityId}`;
