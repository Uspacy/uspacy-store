import { IStage, IStages } from '@uspacy/sdk/lib/models/crm-stages';

export const sortStagesWhenCreateNew = (stages: IStages, actionPayLoad: IStage) => {
	const lastItemsFailAndSuccess = stages.data
		.filter((it) => it.stage_code === 'FAIL' || it.stage_code === 'SUCCESS')
		.map((el) => ({ ...el, sort: +el.sort + 10 }));
	const withoutFailAndSuccess = stages.data.filter((it) => it.stage_code !== 'FAIL' && it.stage_code !== 'SUCCESS');
	withoutFailAndSuccess.push(actionPayLoad);
	return [...withoutFailAndSuccess.sort((a, b) => a.sort - b.sort), ...lastItemsFailAndSuccess];
};
