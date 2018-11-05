import React from 'react';
import PropTypes from 'prop-types';
import {Connectors} from '@nti/lib-store';

import {findLineInContainer}  from './line-resolution';

function lineInfoEqual (a, b) {
	if ((a && !b) || (!a && b)) { return false; }

	return a === b ||
		a.range === b.range ||
		(
			a.range.startContainer === b.range.startContainer &&
			a.range.startOffset === b.range.startOffset &&
			a.range.endContainer === b.range.endContainer &&
			a.range.endOffset === b.range.endOffset
		);
}

function getStylesForLine (line, contentBody) {
	//TODO: investigate why contentBody clientTop and offsetTop, but the bounding rect's top is 15
	const top = line.rect.top - contentBody.getBoundingClientRect().top;

	return {
		top: `${Math.max(0, Math.round(top))}px`
	};
}

@Connectors.Any.connect(['contentBody'])
class NTIContentAnnotationsGutter extends React.Component {
	static propTypes = {
		items: PropTypes.object,

		contentBody: PropTypes.object
	}

	state = {}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentWillUnmount () {
		if (this.cleanup) {
			this.cleanup();
		}
	}

	componentDidUpdate (prevProps) {
		const {contentBody} = this.props;
		const {contentBody: prevContentBody} = prevProps;

		if (contentBody !== prevContentBody) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {contentBody} = props;

		if (!contentBody) { return; }

		if (this.cleanup) { this.cleanup(); }

		contentBody.addEventListener('mousemove', this.onMouseMove);
		contentBody.addEventListener('mouseout', this.onMouseOut);

		this.cleanup = () => {
			contentBody.removeEventListener('mousemove', this.onMouseMove);
			contentBody.removeEventListener('mouseout', this.onMouseOut);
			delete this.cleanup;
		};
	}


	onMouseMove = (e) => {
		clearTimeout(this.hideOnMouseOutTimeout);

		const {contentBody} = this.props;
		const {clientY} = e;

		const {lineInfo:oldLineInfo} = this.state;
		const newLineInfo = findLineInContainer(clientY, contentBody);

		if (!lineInfoEqual(oldLineInfo, newLineInfo)) {
			this.setState({
				lineInfo: newLineInfo,
				noteHerePosition: getStylesForLine(newLineInfo, contentBody)
			});
		}
	}

	onMouseOut = (e) => {
		clearTimeout(this.hideOnMouseOutTimeout);

		this.hideOnMouseOutTimeout = setTimeout(() => {
			this.setState({
				lineInfo: null
			});
		}, 100);
	}


	render () {
		const {lineInfo, noteHerePosition} = this.state;

		return (
			<div className="nti-content-annotations-gutter">
				{lineInfo && (
					<div className="note-here" style={noteHerePosition}>
						{noteHerePosition.top}
					</div>
				)}
			</div>
		);
	}
}

export {NTIContentAnnotationsGutter as default};
