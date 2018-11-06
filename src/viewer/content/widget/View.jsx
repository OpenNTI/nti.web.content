import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Connectors} from '@nti/lib-store';

import {getCmpFor} from './types';

function getElementById (id) {
	return typeof document !== 'undefined' ? document.getElementById(id) : null;
}

ContentViewerWidget.propTypes = {
	part: PropTypes.shape({
		guid: PropTypes.string.isRequired
	}).isRequired,
	bundle: PropTypes.object
};
function ContentViewerWidget ({part, bundle, ...otherProps}) {
	//While its probably technically more correct to get the element from the content body,
	//since we are using an id its faster to use document.getElementById
	const node = getElementById(part.guid);
	const Cmp = getCmpFor(part);

	return ReactDOM.createPortal(
		(<Cmp part={part} node={node} contentPackage={bundle}/>),
		node
	);
}


export default
@Connectors.Any.connect(['contentBody'])
class ContentViewerWidgetWrapper extends React.Component {
	static propTypes = {
		part: PropTypes.object,

		contentBody: PropTypes.object
	}


	componentDidCatch (...args) {
		const {part} = this.props;

		const node = getElementById(part.guid);

		if (node) {
			node.innerHTML = '<error><span>Missing Component</span></error>';
		}

		console.error('Unable to render widget: ', ...args);//eslint-disable-line
	}


	render () {
		const {contentBody} = this.props;

		if (!contentBody) { return null; }

		return (
			<ContentViewerWidget {...this.props} />
		);
	}
}
