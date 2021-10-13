import './View.scss';
import PropTypes from 'prop-types';

import { ContextProvider, EditorGroup } from '@nti/web-editor';

import TypeFormat from './TypeFormat';
import StyleInsertFormat from './StyleInsertFormat';
import Status from './Status';
import Publish from './Publish';

ContentEditorControls.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object,
	navigateToPublished: PropTypes.func,
	readOnly: PropTypes.bool,
	selectionManager: PropTypes.shape({
		addListener: PropTypes.func,
		removeListener: PropTypes.func,
	}),
};
export default function ContentEditorControls({
	contentPackage,
	course,
	navigateToPublished,
	readOnly,
}) {
	const editor = EditorGroup.useFocusedEditor();

	return (
		<ContextProvider editor={editor}>
			<div className="content-editor-controls">
				<TypeFormat editor={editor} />
				<StyleInsertFormat editor={editor} />
				<div className="spacer" />
				<Status />
				<Publish
					contentPackage={contentPackage}
					navigateToPublished={navigateToPublished}
					disabled={readOnly}
				/>
			</div>
		</ContextProvider>
	);
}
