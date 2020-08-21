import './TypeFormat.scss';
import PropTypes from 'prop-types';
import React from 'react';
import {scoped} from '@nti/lib-locale';
import {Flyout} from '@nti/web-commons';
import {ActiveType, TypeButton, ContextProvider, BLOCKS} from '@nti/web-editor';

const DEFAULT_TEXT = {
	[BLOCKS.HEADER_TWO]: 'Title',
	[BLOCKS.HEADER_THREE]: 'Section Title',
	[BLOCKS.HEADER_FOUR]: 'Paragraph Headline',
	[BLOCKS.BLOCKQUOTE]: 'Block Quote',
	[BLOCKS.UNSTYLED]: 'Body Text',
	[BLOCKS.ORDERED_LIST_ITEM]: 'Numbered List',
	[BLOCKS.UNORDERED_LIST_ITEM]: 'Bulleted List'
};

const t = scoped('web-content.editor.controls.TypeFormat', DEFAULT_TEXT);
const typeClass = 'content-editor-type-button';
const trigger = (<ActiveType className="content-editor-active-type" getString={t} />);

export default class ContentEditorTypeFormat extends React.Component {
	static propTypes = {
		editor: PropTypes.object
	};

	setFlyoutRef = x => this.flyoutRef = x;

	closeMenu = () => {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	};

	render () {
		return (
			<div className="content-editor-type-format">
				<Flyout.Triggered
					ref={this.setFlyoutRef}
					className="content-editor-type-formats"
					trigger={trigger}
					verticalAlign={Flyout.ALIGNMENTS.TOP}
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
					focusOnOpen={false}
				>
					{this.renderFlyout()}
				</Flyout.Triggered>
			</div>
		);
	}

	renderFlyout = () => {
		const {editor} = this.props;
		return (
			<ContextProvider editor={editor}>
				<div className="content-editor-type-flyout">
					<ul className="plain">
						<li><TypeButton onMouseDown={this.closeMenu} className={typeClass} type={BLOCKS.HEADER_TWO} getString={t} plain checkmark /></li>
						<li><TypeButton onMouseDown={this.closeMenu} className={typeClass} type={BLOCKS.HEADER_THREE} getString={t} plain checkmark /></li>
						<li><TypeButton onMouseDown={this.closeMenu} className={typeClass} type={BLOCKS.HEADER_FOUR} getString={t} plain checkmark /></li>
						<li><TypeButton onMouseDown={this.closeMenu} className={typeClass} type={BLOCKS.BLOCKQUOTE} getString={t} plain checkmark /></li>
						<li><TypeButton onMouseDown={this.closeMenu} className={typeClass} type={BLOCKS.UNSTYLED} getString={t} plain checkmark /></li>
					</ul>
					<ul className="lists">
						<li><TypeButton onMouseDown={this.closeMenu} className={typeClass} type={BLOCKS.ORDERED_LIST_ITEM} getString={t} plain checkmark /></li>
						<li><TypeButton onMouseDown={this.closeMenu} className={typeClass} type={BLOCKS.UNORDERED_LIST_ITEM} getString={t} plain checkmark /></li>
					</ul>
				</div>
			</ContextProvider>
		);
	};
}
