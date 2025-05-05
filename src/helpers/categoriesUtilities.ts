import { IProductCategory } from '@uspacy/sdk/lib/models/crm-products-category';

export const removeCategory = (categories: IProductCategory[], idToRemove: number, moveChildrenToParent: boolean = false): IProductCategory[] => {
	const traverse = (list: IProductCategory[]): IProductCategory[] => {
		let changed = false;

		const result = list.reduce((acc, item) => {
			if (item.id === idToRemove) {
				changed = true;

				if (moveChildrenToParent && item.child_categories?.length) {
					acc.push(...item.child_categories);
				}

				return acc;
			}

			if (item.child_categories?.length) {
				const updatedChildren = traverse(item.child_categories);

				if (
					updatedChildren.length !== item.child_categories.length ||
					!updatedChildren.every((c, i) => c.id === item.child_categories![i].id)
				) {
					changed = true;
					acc.push({
						...item,
						child_categories: updatedChildren,
					});
				} else {
					acc.push(item);
				}
			} else {
				acc.push(item);
			}

			return acc;
		}, [] as IProductCategory[]);

		return changed ? result : list;
	};

	return traverse(categories);
};

export const addCategoryRecursively = (categories: IProductCategory[], newCategory: IProductCategory): IProductCategory[] => {
	const parentId = newCategory.parent_id;

	if (!parentId || parentId <= 0) {
		return [...categories, newCategory];
	}

	let parentFound = false;

	const traverse = (list: IProductCategory[]): IProductCategory[] => {
		if (parentFound) return list;

		return list.reduce((acc, item) => {
			if (parentFound) {
				acc.push(item);
				return acc;
			}

			if (item.id === parentId) {
				parentFound = true;
				acc.push({
					...item,
					child_categories: [...(item.child_categories || []), newCategory],
				});
				return acc;
			}

			if (item.child_categories?.length) {
				const updatedChildren = traverse(item.child_categories);

				if (parentFound) {
					acc.push({
						...item,
						child_categories: updatedChildren,
					});
				} else {
					acc.push(item);
				}
			} else {
				acc.push(item);
			}

			return acc;
		}, [] as IProductCategory[]);
	};

	const result = traverse(categories);
	return parentFound ? result : [...categories, newCategory];
};

export const updateCategoryArray = (categories: IProductCategory[], updatedCategory: IProductCategory): IProductCategory[] => {
	const withoutOld = removeCategory(categories, updatedCategory.id);

	return addCategoryRecursively(withoutOld, updatedCategory);
};
