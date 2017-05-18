import React from 'react';
import {scoped} from 'nti-lib-locale';
import {Flyout} from 'nti-web-commons';

import {ActiveType, TypeButton, ContextProvider, BLOCKS} from '../../draft-core';

const DEFAULT_TEXT = {
	[BLOCKS.HEADER_TWO]: 'Title',
	[BLOCKS.HEADER_THREE]: 'Section Title',
	[BLOCKS.HEADER_FOUR]: 'Paragraph Headline',
	[BLOCKS.UNSTYLED]: 'Body Text',
	[BLOCKS.ORDERED_LIST_ITEM]: 'Numbered List',
	[BLOCKS.UNORDERED_LIST_ITEM]: 'Bulleted List'
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
			<Flyout.Triggered className="content-editor-type-formats" trigger={trigger} verticalAlign={Flyout.ALIGNMENTS.TOP} horizontalAlign={Flyout.ALIGNMENTS.LEFT}>
				<ContextProvider editor={editor}>
					<div className="content-editor-type-flyout">
						<ul className="plain">
							<li><TypeButton className={typeClass} type={BLOCKS.HEADER_TWO} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={BLOCKS.HEADER_THREE} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={BLOCKS.HEADER_FOUR} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={BLOCKS.UNSTYLED} getString={t} plain checkmark /></li>
						</ul>
						<ul className="lists">
							<li><TypeButton className={typeClass} type={BLOCKS.ORDERED_LIST_ITEM} getString={t} plain checkmark /></li>
							<li><TypeButton className={typeClass} type={BLOCKS.UNORDERED_LIST_ITEM} getString={t} plain checkmark /></li>
						</ul>
					</div>
				</ContextProvider>
			</Flyout.Triggered>
		</div>
	);
}
