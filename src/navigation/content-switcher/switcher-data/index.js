import getContentData from './get-content-data';
import getFamilyData from './get-family-data';

function getData(content, route) {
	const family = content.getCatalogFamily && content.getCatalogFamily();

	return family
		? getFamilyData(family, content, route)
		: getContentData(content, route);
}

function indexOfData(items, data) {
	return items.findIndex(item => item.id === data.id);
}

function mergeData(updated = {}, original = {}) {
	const merged = {
		...original,
		...updated,
		route: updated.route || original.route,
	};

	if (updated.family && original.family) {
		const map = original.family.reduce((acc, fam) => {
			acc[fam.id] = fam;
			return acc;
		}, {});

		merged.family = updated.family.map(fam => {
			return mergeData(fam, map[fam.id] || {});
		});
	}

	return merged;
}

export async function insertInto(items, content, route) {
	const data = await getData(content, route);

	if (!items) {
		return [data];
	}

	const index = indexOfData(items, data);

	if (index < 0) {
		return [data, ...items];
	}

	const newItems = [...items];
	const original = newItems.splice(index, 1)[0];
	const merged = mergeData(data, original);

	newItems.unshift(merged);

	return newItems;
}

export async function updateData(items, content) {
	const data = await getData(content);
	const index = indexOfData(items, data);

	if (index < 0) {
		return items;
	}

	const newItems = [...items];

	newItems[index] = mergeData(data, newItems[index]);

	return newItems;
}
