import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

import Store from './Store';
import Widget from './widget';

export default
@Store.connect(['loading', 'error', 'pageDescriptor', 'setContentBody'])
class ContentViewer extends React.Component {
	static deriveBindingFromProps ({contentPackage, pageId}) {
		return {
			contentPackage,
			pageId
		};
	}

	static propTypes = {
		contentPackage: PropTypes.object.isRequired,
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


	render () {
		const {loading, error, pageDescriptor} = this.props;
		const isLoading = loading || (!error && !pageDescriptor);

		return (
			<div>
				{isLoading && (<div>Loading...</div>)}
				{!isLoading && error && (<div>Error...</div>)}
				{!isLoading && !error && this.renderPage()}
			</div>
		);
	}


	renderPage () {
		const {pageDescriptor} = this.props;
		const body = pageDescriptor.getBodyParts();

		const {content, widgets} = body.reduce((acc, part) => {
			if (typeof part === 'string') {
				return {content: acc.content + part, widgets: acc.widgets};
			}

			const widgetHTML = `<widget id="${part.guid}"></widget>`;

			return {content: acc.content + widgetHTML, widgets: [...acc.widgets, part]};
		}, {content: '', widgets: []});


		return (
			<>
				<div {...rawContent(content)} ref={this.attachContentBody} />
				{widgets.map((widget) => {
					return (
						<Widget key={widget.guid} part={widget} />
					);
				})}
			</>
		);
	}
}
