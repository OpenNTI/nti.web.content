import React from 'react';
import PropTypes from 'prop-types';
import {Connectors} from '@nti/lib-store';

import {findLineInContainer, resolveBins}  from './line-resolution';

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
		annotations: PropTypes.object,//annotation dictionary {[obj.id]: obj}

		contentBody: PropTypes.object
	}

	state = {}


	componentDidMount () {
		this.setupListeners(this.props);
		this.setupAnnotations(this.props);
	}


	componentWillUnmount () {
		if (this.cleanup) {
			this.cleanup();
		}
	}

	componentDidUpdate (prevProps) {
		const {contentBody, annotations} = this.props;
		const {contentBody: prevContentBody, annotations: prevAnnotations} = prevProps;

		if (contentBody !== prevContentBody) {
			this.setupListeners(this.props);
		}

		if (annotations !== prevAnnotations) {
			this.setupAnnotations(this.props);
		}
	}


	setupAnnotations (props) {
		const {annotations} = props;
		const items = annotations && Object.values(annotations);

		if (!items || items.length <= 0) { return; }


		const {bins, shouldRetry} = resolveBins(items);

		if (shouldRetry) {
			this.setState({bins: null}, () => {
				setTimeout(() => {
					this.setupAnnotations(props);
				}, 200);
			});
		}

		this.setState({bins});
	}


	setupListeners (props) {
		//NOTE: if we end up needing to deal with state in this method,
		//we might want to try to combine it with setupAnnotations.
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

		if (!newLineInfo) {
			this.setState({
				lineInfo: null,
				noteHerePosition: null
			});
		}else if (!lineInfoEqual(oldLineInfo, newLineInfo)) {
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
		const {lineInfo, noteHerePosition, bins} = this.state;

		return (
			<div className="nti-content-annotations-gutter">
				{bins && this.renderBins(bins)}
				{lineInfo && (
					<div className="note-here" style={noteHerePosition}>
						{noteHerePosition.top}
					</div>
				)}
			</div>
		);
	}


	renderBins (bins) {
		const positions = Object.keys(bins);

		return (
			<>
				{positions.map((y) => {
					const bin = bins[y];
					const top = {top: `${y}px`};
					const count = (bin || []).length;

					return (
						<span key={y} className="gutter-bin" style={top}>
							{count > 99 ? '99+' : count}
						</span>
					);
				})}
			</>
		);
	}
}

export {NTIContentAnnotationsGutter as default};
