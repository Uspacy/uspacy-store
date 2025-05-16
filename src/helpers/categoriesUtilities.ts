import { IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

export const sortCategories = (categories: IProductCategory[]): IProductCategory[] => {
	const sorted = categories
		.map((cat) => ({ ...cat }))
		.sort((a, b) => {
			const aSort = typeof a.sort === 'number' ? a.sort : Number.MAX_SAFE_INTEGER;
			const bSort = typeof b.sort === 'number' ? b.sort : Number.MAX_SAFE_INTEGER;
			return aSort - bSort;
		});

	let currentSort = 10;
	for (let i = 0; i < sorted.length; i++) {
		if (typeof sorted[i].sort !== 'number') {
			sorted[i].sort = currentSort;
		}
		currentSort = sorted[i].sort + 10;
	}

	return sorted.map((category) => ({
		...category,
		child_categories: category.child_categories?.length ? sortCategories(category.child_categories) : [],
	}));
};

const addCategoryRecursively = (categories: IProductCategory[], newCategory: IProductCategory): IProductCategory[] => {
	const parentId = newCategory.parent_id;

	if (!parentId || parentId <= 0) {
		return insertAndShiftSort(categories, newCategory);
	}

	const traverse = (list: IProductCategory[]): IProductCategory[] => {
		return list.map((item) => {
			if (item.id === parentId) {
				return {
					...item,
					child_categories: insertAndShiftSort(item.child_categories || [], newCategory),
				};
			}

			return {
				...item,
				child_categories: item.child_categories?.length ? traverse(item.child_categories) : item.child_categories,
			};
		});
	};

	const updated = traverse(categories);

	const parentExists = JSON.stringify(updated) !== JSON.stringify(categories);
	return parentExists ? updated : insertAndShiftSort(categories, newCategory);
};

const insertAndShiftSort = (list: IProductCategory[], category: IProductCategory): IProductCategory[] => {
	const updatedList = list.filter((item) => item.id !== category.id);

	const hasSort = typeof category.sort === 'number';
	let tempSort = category.sort;

	if (hasSort) {
		const oldItem = list.find((item) => item.id === category.id);
		const oldSort = oldItem?.sort ?? 10;
		const direction = (category.sort ?? 10) > oldSort ? 5 : -5;
		tempSort = (category.sort ?? 10) + direction;
	} else {
		const maxSort = Math.max(-10, ...updatedList.map((item) => item.sort ?? -10));
		tempSort = maxSort + 10;
	}

	const preparedCategory: IProductCategory = {
		...category,
		sort: tempSort,
	};

	const finalList = [...updatedList, preparedCategory].sort((a, b) => (a.sort ?? 10) - (b.sort ?? 10));

	return finalList.map((item, index) => ({
		...item,
		sort: index * 10,
	}));
};

export const removeCategory = (categories: IProductCategory[], idToRemove: number, moveChildrenToParent: boolean = false): IProductCategory[] => {
	const traverse = (list: IProductCategory[]): IProductCategory[] => {
		const filtered = list.flatMap((item) => {
			if (item.id === idToRemove) {
				return moveChildrenToParent && item.child_categories?.length ? item.child_categories : [];
			}

			const updatedChildren = item.child_categories?.length ? traverse(item.child_categories) : undefined;

			return {
				...item,
				...(updatedChildren ? { child_categories: updatedChildren } : {}),
			};
		});

		return filtered
			.sort((a, b) => (a.sort ?? 10) - (b.sort ?? 10))
			.map((item, index) => ({
				...item,
				sort: index * 10,
			}));
	};

	return traverse(categories);
};

export const updateCategoryArray = (categories: IProductCategory[], updatedCategory: IProductCategory): IProductCategory[] => {
	const { id, parent_id: newParentId, sort: intendedSort } = updatedCategory;

	const findCategory = (list: IProductCategory[]): IProductCategory | null => {
		for (const item of list) {
			if (item.id === id) return item;
			if (item.child_categories?.length) {
				const foundInChildren = findCategory(item.child_categories);
				if (foundInChildren) return foundInChildren;
			}
		}
		return null;
	};

	const existingCategory = findCategory(categories);
	if (!existingCategory) return categories;

	const oldSort = existingCategory.sort ?? 10;
	const newSort = intendedSort != null ? intendedSort + (intendedSort > oldSort ? 5 : -5) : oldSort;

	const parentChanged = existingCategory.parent_id !== newParentId;
	const sortChanged = oldSort !== newSort;

	if (!parentChanged && !sortChanged) {
		const updateInPlace = (list: IProductCategory[]): IProductCategory[] => {
			return list.map((item) => {
				if (item.id === id) return updatedCategory;

				if (item.child_categories?.length) {
					return {
						...item,
						child_categories: updateInPlace(item.child_categories),
					};
				}

				return item;
			});
		};

		return updateInPlace(categories);
	}

	const modifiedCategory = {
		...updatedCategory,
		sort: newSort,
	};

	const removed = removeCategory(categories, id);
	return addCategoryRecursively(removed, modifiedCategory);
};
