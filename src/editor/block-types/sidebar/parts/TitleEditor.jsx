import React from 'react';
import PropTypes from 'prop-types';

import RSTFieldEditor from '../../RSTFieldEditor';

SidebarTitleEditor.propTypes = {
	blockId: PropTypes.string
};
export default function SidebarTitleEditor ({blockId, ...otherProps}) {
	return (
		<RSTFieldEditor
			{...otherProps}
			className="content-editing-sidebar-title-editor"
			fieldId={`${blockId}-title-editor`}
			contentChangeBuffer={500}
			placeholder="Title"
		/>
	);
}
