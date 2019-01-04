function getPresentationResources (content) {
	if (content.PlatformPresentationResources) { return content.PlatformPresentationResources; }

	return content.CatalogEntry.PlatformPresentationResources;
}


export default function getContentData (content, route) {
	const properties = content.getPresentationProperties();

	return {
		...properties,
		id: content.getID(),
		canEdit: content.isCourse ?
			content.CatalogEntry.hasLink('edit') :
			content.hasLink('edit'),
		canDelete: content.hasLink('delete'),
		canPublish: content.isCourse ?
			content.CatalogEntry.hasLink('edit') :
			(content.canPublish() || content.canUnpublish()),
		PlatformPresentationResources: getPresentationResources(content),
		MimeType: content.MimeType,
		type: content.isCourse ? 'course' : 'book',
		route
	};
}
