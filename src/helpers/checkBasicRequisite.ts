import { IRequisite } from '@uspacy/sdk/lib/models/requisites';

export const checkBasicRequisite = (requisites: IRequisite[], updateRequisite: IRequisite) => {
	return requisites.map((req) => {
		const newBase = updateRequisite.is_basic;
		if (req?.id === updateRequisite.id) return { ...req, ...updateRequisite };
		return { ...req, is_basic: newBase ? false : req.is_basic };
	});
};
