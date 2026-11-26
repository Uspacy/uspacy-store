import { IEntityData } from '@uspacy/sdk/lib/models/crm-entities';

import { EntityItems } from './types';

type StageState = NonNullable<EntityItems['stages']>[string];

export interface IStageLocation {
	key: string;
	index: number;
}

export const isStale = (incoming?: Partial<IEntityData>, current?: Partial<IEntityData>) =>
	!!incoming?.updated_at && !!current?.updated_at && incoming.updated_at < current.updated_at;

/**
 * Finds item in kanban stages. Checks the hinted stage first, so in the common case only one column is scanned.
 */
export const findItemInStages = (entity: EntityItems | undefined, id: number, hintKey?: string | number): IStageLocation | undefined => {
	const stages = entity?.stages;
	if (!stages) return undefined;
	const hint = hintKey !== undefined && hintKey !== null && hintKey !== '' ? String(hintKey) : undefined;
	if (hint && Array.isArray(stages[hint]?.data)) {
		const index = stages[hint].data.findIndex((item) => item.id === id);
		if (index !== -1) return { key: hint, index };
	}
	for (const key of Object.keys(stages)) {
		if (key === hint || !Array.isArray(stages[key]?.data)) continue;
		const index = stages[key].data.findIndex((item) => item.id === id);
		if (index !== -1) return { key, index };
	}
	return undefined;
};

/**
 * Merges data into the item with the same id. Only the matching element is replaced,
 * the array reference stays untouched when nothing is found (no rerender of the list).
 */
export const patchItemInList = (list: IEntityData[] | undefined, data: Partial<IEntityData> & { id: number }, checkStale = true): boolean => {
	if (!Array.isArray(list)) return false;
	const index = list.findIndex((item) => item.id === data.id);
	if (index === -1) return false;
	if (checkStale && isStale(data, list[index])) return false;
	list[index] = { ...list[index], ...data };
	return true;
};

export const removeFromStage = (stage: StageState, index: number): IEntityData => {
	const [removed] = stage.data.splice(index, 1);
	if (stage.meta) stage.meta.total = Math.max((stage.meta.total || 1) - 1, 0);
	return removed;
};

export const insertIntoStage = (stage: StageState, item: IEntityData, index = 0) => {
	if (stage.data.some((it) => it.id === item.id)) return false;
	stage.data.splice(Math.min(Math.max(index, 0), stage.data.length), 0, item);
	if (stage.meta) stage.meta.total = (stage.meta.total || 0) + 1;
	return true;
};

export const decreaseStageTotal = (stage?: StageState) => {
	if (stage?.meta) stage.meta.total = Math.max((stage.meta.total || 1) - 1, 0);
};

/**
 * Moves (or just updates) the card between kanban columns touching only the source and target stages.
 * - when the item is not loaded in the source column, only the source total is decreased
 * - when the target column is not on the board (other funnel / filtered out), the card is only removed
 */
export const moveCardBetweenStages = (
	entity: EntityItems,
	{
		id,
		targetStageId,
		sourceStageId,
		data,
		removeOnly,
		destinationIndex,
		fallbackItem,
	}: {
		id: number;
		targetStageId: number | string;
		sourceStageId?: number | string;
		data?: Partial<IEntityData>;
		removeOnly?: boolean;
		destinationIndex?: number;
		fallbackItem?: IEntityData;
	},
) => {
	if (!entity?.stages) return;
	const targetKey = String(targetStageId);
	const location = findItemInStages(entity, id, sourceStageId);

	if (location && location.key === targetKey && !removeOnly) {
		const current = entity.stages[targetKey].data[location.index];
		if (data && !isStale(data, current)) entity.stages[targetKey].data[location.index] = { ...current, ...data };
		return;
	}

	let item: IEntityData | undefined;
	if (location) {
		item = removeFromStage(entity.stages[location.key], location.index);
	} else if (sourceStageId !== undefined && sourceStageId !== null && String(sourceStageId) !== targetKey) {
		decreaseStageTotal(entity.stages[String(sourceStageId)]);
	}

	if (removeOnly) return;
	const target = entity.stages[targetKey];
	if (!Array.isArray(target?.data)) return;
	const base = item ?? fallbackItem;
	if (!base) return;
	insertIntoStage(target, { ...base, ...(data || {}), kanban_stage_id: Number(targetStageId) } as IEntityData, destinationIndex);
};
