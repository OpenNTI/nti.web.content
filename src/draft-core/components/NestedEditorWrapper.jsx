import React from 'react';
import PropTypes from 'prop-types';

//Inspired by: https://github.com/draft-js-plugins/draft-js-plugins/blob/master/legacy/draft-js-table-plugin/src/components/nested-editor.js
//TODO: figure out a better way to nest draft-js editors

const stop = e => e.stopPropagation();

const EVENTS = {
	keydown: stop,
	mousedown: stop,
	selectionchange: stop,
	focusin: stop,
	focusout: stop
};

function forEachEvent (fn) {
	Object.keys(EVENTS).forEach(name => fn(name, EVENTS[name]));
}

export default class NestedEditorWrapper extends React.Component {
	static propTypes = {
		children: PropTypes.node
	}


	onKeyDown = (e) => {
		if (event.keyCode === 38) {
			stop(e);
		} else if (event.keyCode === 40) {
			stop(e);
		} else if (event.keyCode === 8) {
			stop(e);
		}
	}


	attachWrapperRef = (wrapper) => {
		if (this.unsubscribe) { this.unsubscribe(); }

		if (!wrapper) {
			return;
		}

		this.unsubscribe = () => {
			forEachEvent((name, handler) => {
				wrapper.removeEventListener(name, handler, false);
				wrapper.addEventListener(name, handler, true);
			});
		};

		forEachEvent((name, handler) => {
			wrapper.addEventListener(name, handler, false);
			wrapper.addEventListener(name, handler, true);
		});
	}


	render () {
		const {children, ...otherProps} = this.props;

		return (
			<div {...otherProps} ref={this.attachWrapperRef} >
				{children}
			</div>
		);
	}
}
