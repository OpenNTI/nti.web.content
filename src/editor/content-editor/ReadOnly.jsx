import React from 'react';

import { scoped } from '@nti/lib-locale';
import { EmptyState } from '@nti/web-commons';

const DEFAULT_TEXT = {
	empty: 'This reading is not available for editing.',
};

const t = scoped('web-content.editor.content-editor.ReadOnly', DEFAULT_TEXT);

export default function ReadOnly() {
	return <EmptyState header={t('empty')} />;
}
