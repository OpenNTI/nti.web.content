import getWordsForDefinition from './get-words-for-definition';
import canShowDefinitions from './can-show-definitions';

export default function hasContextToShow (userSelection, pageDescriptor, annotations) {
	return annotations || (canShowDefinitions(pageDescriptor) && getWordsForDefinition(userSelection) !== '');
}
