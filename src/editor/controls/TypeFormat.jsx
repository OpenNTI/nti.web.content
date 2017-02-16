import React from 'react';
import {scoped} from 'nti-lib-locale';
import {Flyout} from 'nti-web-commons';

import {ActiveType, TypeButton, ContextProvider} from '../../draft-core';

const {Types} = TypeButton;

const DEFAULT_TEXT = {
	[Types.HEADER_ONE]: 'Title',
	[Types.HEADER_TWO]: 'Section Title',
	[Types.HEADER_THREE]: 'Paragraph Headline',
	[Types.UNSTYLED]: 'Body Text',
	[Types.ORDERED_LIST_ITEM]: 'Numbered List',
	[Types.UNORDERED_LIST_ITEM]: 'Bulleted List'
};

const t = scoped('CONTENT_EDITOR_TYPE_FORMAT', DEFAULT_TEXT);
const typeClass = 'content-editor-type-button';


ContentEditorTypeFormat.propTypes = {
	editor: React.PropTypes.object
};
export default function ContentEditorTypeFormat ({editor}) {
	const trigger = (<ActiveType className="content-editor-active-type" getString={t} />);

	return (
		<div className="content-editor-type-format">
			<Flyout className="content-editor-type-formats" trigger={trigger} verticalAlign={Flyout.ALIGNMENTS.TOP} horizontalAlign={Flyout.ALIGNMENTS.LEFT}>
				<ContextProvider editor={editor}>
					<div className="content-editor-type-flyout">
						<ul className="plain">
							<li><TypeButton className={typeClass} type={Types.HEADER_ONE} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={Types.HEADER_TWO} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={Types.HEADER_THREE} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={Types.UNSTYLED} getString={t} plain checkmark /></li>
						</ul>
						<ul className="lists">
							<li><TypeButton className={typeClass} type={Types.ORDERED_LIST_ITEM} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={Types.UNORDERED_LIST_ITEM} getString={t} plain checkmark /></li>
						</ul>
					</div>
				</ContextProvider>
			</Flyout>
		</div>
	);
}
