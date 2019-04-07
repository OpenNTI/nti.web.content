import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Container.css';
import {Anchors} from './anchors';
import Gutter from './gutter';

const cx = classnames.bind(Styles);

export default class Annotatable extends React.Component {
	static Anchors = Anchors;

	static propTypes = {
		children: PropTypes.any
	}

	state = {}

	attachContainerRef = (node) => {
		if (node !== this.container) {
			this.container = node;
			this.maybeSetUp();
		}
	}

	attachContentRef = (node) => {
		if (node !== this.content) {
			this.content = node;
			this.maybeSetUp();
		}
	}

	maybeSetUp () {
		if (!this.container || !this.content) { return; }

		if (this.cleanUpLoadListener) { this.cleanUpLoadListener(); }

		this.content.addEventListener('load', this.onContentImageLoad, true);
		this.cleanUpLoadListener = () => {
			this.content.removeEventListener(this.onContentImageLoad, true);
			this.cleanUpLoadListener = void 0;
		};

		this.setState({
			container: this.container,
			content: this.content
		});
	}


	onContentImageLoad = () => {
		if (this.contentLoadUpdateTimeout) { return; }

		this.contentLoadUpdateTimeout = setTimeout(() => {
			this.forceUpdate();
			this.contentLoadUpdateTimeout = void 0;
		}, 10);
	}


	render () {
		const {children, ...otherProps} = this.props;
		const {content, container} = this.state;

		return (
			<div className={cx('annotatable-container')} ref={this.attachContainerRef}>
				<div className={cx('content')} ref={this.attachContentRef}>
					{children}
				</div>
				<Gutter {...otherProps} content={content} container={container} className={cx('gutter')} />
			</div>
		);
	}
}
