import getContentData from './get-content-data';

async function getFamilyMembers(family, content, route) {
	const familyId = family.getFamilyID();
	const currentEntry = content.CatalogEntry;

	try {
		const entries = await content.getCatalogFamilies();

		return entries.reduce((acc, entry) => {
			if (!entry.isInFamily(familyId)) {
				return acc;
			}

			const current = currentEntry.getID() === entry.getID();

			acc.push({
				id: current ? content.getID() : entry.getID(),
				title: entry.ProviderUniqueID,
				current,
				MimeType: entry.MimeType,
				route: current ? route : null,
				type: entry.isCourse ? 'course' : 'book',
			});

			return acc;
		}, []);
	} catch (e) {
		return [];
	}
}

export default async function getFamilyData(family, content, route) {
	const familyMembers = await getFamilyMembers(family, content, route);
	const contentData = getContentData(content, route);

	return {
		...contentData,
		...family.getPresentationProperties(),
		PlatformPresentationResources: family.PlatformPresentationResources,
		family: familyMembers,
		route: null,
	};
}
