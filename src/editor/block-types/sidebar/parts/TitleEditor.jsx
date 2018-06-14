import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import RSTFieldEditor from '../../RSTFieldEditor';

const t = scoped('content.editor.block-types.sidebar.TitleEditor', {
	placeholder: 'Enter a title...'
});

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
			placeholder={t('placeholder')}
		/>
	);
}
