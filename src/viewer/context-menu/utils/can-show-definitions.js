export default function canShowDefinitions (pageDescriptor) {
	return pageDescriptor && pageDescriptor.pageInfo && pageDescriptor.pageInfo.hasLink('Glossary');
}
