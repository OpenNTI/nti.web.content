import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getEventTarget} from '@nti/lib-dom';
import {rawContent} from '@nti/lib-commons';
import {NTIContent, Loading} from '@nti/web-commons';
import isTouch from '@nti/util-detection-touch';
import {Connectors} from '@nti/lib-store';

import {snapSelectionToWord} from '../utils';

import Widget from './widget';

export default
@Connectors.Any.connect(['loading', 'error', 'pageDescriptor', 'setContentBody'])
class ContentViewer extends React.Component {
	static deriveBindingFromProps ({bundle, pageId}) {
		return {
			bundle,
			pageId
		};
	}

	static propTypes = {
		className: PropTypes.string,
		bundle: PropTypes.object.isRequired,
		pageId: PropTypes.string.isRequired,

		loading: PropTypes.bool,
		error: PropTypes.any,
		pageDescriptor: PropTypes.object,
		setContentBody: PropTypes.func
	}


	attachContentBody = (node) => {
		const {setContentBody} = this.props;

		this.contentBody = node;

		if (setContentBody) {
			setContentBody(node);
		}
	}


	getOtherProps () {
		let props = {...this.otherProps};

		for (let key of Object.keys(ContentViewer.propTypes)) {
			delete props[key];
		}

		return props;
	}


	detectSelection = (e) => {
		//don't show the selection for inputs or contenteditbles
		if (getEventTarget(e, 'input') || getEventTarget(e, '[contenteditable]')) {
			return;
		}

		const selection = global.getSelection();
		const originalRange = selection && selection.rangeCount ? selection.getRangeAt(0) : null;

		if (!originalRange || originalRange.collapsed) { return; }


		const expandedSelection = snapSelectionToWord(selection);
		const expandedRange = expandedSelection && expandedSelection.rangeCount ? expandedSelection.getRangeAt(0) : null;

		return expandedRange;
	}


	render () {
		const {className, loading, error, pageDescriptor} = this.props;
		const isLoading = loading || (!error && !pageDescriptor);

		const listeners = {
			[isTouch ? 'onTouchEnd' : 'onMouseUp']: this.detectSelection
		};

		return (
			<div className={cx('nti-content-viewer', className)} {...this.getOtherProps()} {...listeners} >
				{isLoading && (<Loading.Mask />)}
				{!isLoading && error && (<div>Error...</div>)}
				{!isLoading && !error && this.renderPage()}
			</div>
		);
	}


	renderPage () {
		const {pageDescriptor, pageId, bundle} = this.props;
		const body = pageDescriptor.getBodyParts();
		const styles = pageDescriptor.getPageStyles() || [];

		const {content, widgets} = body.reduce((acc, part) => {
			if (typeof part === 'string') {
				return {content: acc.content + part, widgets: acc.widgets};
			}

			const widgetHTML = `<widget id="${part.guid}"></widget>`;

			return {content: acc.content + widgetHTML, widgets: [...acc.widgets, part]};
		}, {content: '', widgets: []});

		const props = {
			...this.getOtherProps(),
			ref: this.attachContentBody,
			className: 'nti-content-panel',
			'data-ntiid': pageId,
			'data-page-ntiid': pageId
		};

		return (
			<>
				{styles.map((css, i) => {
					return (
						<style scoped type="text/css" key={i} {...rawContent(css)} />
					);
				})}
				<NTIContent {...props}>
					<div id="NTIContent" {...rawContent(content)} />
				</NTIContent>
				{widgets.map((widget) => {
					return (
						<Widget key={widget.guid} part={widget} bundle={bundle} />
					);
				})}
			</>
		);
	}
}
