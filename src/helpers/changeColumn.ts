/* eslint-disable @typescript-eslint/no-explicit-any */
import { IColumns } from '@uspacy/sdk/lib/models/crm-kanban';
import { IStage } from '@uspacy/sdk/lib/models/crm-stages';
import isEmpty from 'lodash/isEmpty';

export const changeColumn = (columns: any, isChanged: boolean, stages: IStage[]): { isUpdateStages: boolean; newStageArray: IStage[] } => {
	const stageColumnArray = Object.values(columns)
		// @ts-ignore
		.map((it) => ({ ...it, id: +it.id }))
		.filter((it) => !isNaN(it.id) && it.id !== 0);
	let isUpdateStages = false;
	let newStageArray = [];
	if (stageColumnArray.length > 0) {
		newStageArray = stageColumnArray.map((it) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { columnUniqueName, items, ...item } = it;
			return item;
		});
		const checkCreateStage = newStageArray.filter((obj1) => !stages.filter((el) => el).some((obj2) => +obj1.id === +obj2.id));
		const checkRemoveStage = stages.filter((obj1) => !newStageArray.some((obj2) => +obj1.id === +obj2.id));
		isUpdateStages = !isEmpty(checkCreateStage) || !isEmpty(checkRemoveStage) || isChanged;
	}
	return { isUpdateStages, newStageArray };
};

export const changeCRMColumn = (columns: IColumns, isChanged: boolean, stages: IStage[]): { isUpdateStages: boolean; newStageArray: IStage[] } => {
	const stageColumnArray = Object.values(columns)
		.map((it) => ({ ...it, id: +it.id }))
		.filter((it) => !isNaN(it.id));
	let isUpdateStages = false;
	let newStageArray = [];
	if (stageColumnArray.length > 0) {
		newStageArray = stageColumnArray.map((it) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { columnUniqueName, items, ...item } = it;
			const findPrevValue = stages.find((el) => el.id === it.id);
			return findPrevValue
				? {
						...item,
						reasons: findPrevValue.reasons,
						stage_code: findPrevValue.stage_code,
						system_stage: findPrevValue.system_stage,
				  }
				: { ...item, reasons: [], system_stage: false };
		});
		const checkCreateStage = newStageArray.filter((obj1) => !stages.some((obj2) => +obj1.id === +obj2.id));
		const checkRemoveStage = stages.filter((obj1) => !newStageArray.some((obj2) => +obj1.id === +obj2.id));
		isUpdateStages = !isEmpty(checkCreateStage) || !isEmpty(checkRemoveStage) || isChanged;
	}
	return { isUpdateStages, newStageArray };
};
