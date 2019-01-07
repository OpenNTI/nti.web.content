function getID (content) {
	return content.CourseNTIID || content.getID();
}


export default function getContentData (content, route) {
	const properties = content.getPresentationProperties();
	const item = content.CatalogEntry || content;

	return {
		...properties,
		id: getID(content),
		canEdit: item.hasLink('edit'),
		canDelete: item.hasLink('delete'),
		canPublish: item.isCourse ?
			item.hasLink('edit') :
			(item.canPublish() || item.canUnpublish()),
		PlatformPresentationResources: item.PlatformPresentationResources,
		MimeType: item.MimeType,
		type: item.isCourse ? 'course' : 'book',
		route
	};
}
