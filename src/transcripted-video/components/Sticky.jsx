import React from 'react';
import PropTypes from 'prop-types';
import {getScrollParent} from '@nti/lib-dom';
import Logger from '@nti/util-logger';
import classnames from 'classnames/bind';

import styles from './Sticky.css';

const cx = classnames.bind(styles);
const logger = Logger.get('transcripted-video:sticky-offset-monitor');
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(v, min));
const ASPECT_RATIO = 0.5625;

export default class Sticky extends React.Component {

	constructor (props) {
		super(props);
		this.domNode = React.createRef();
	}

	static propTypes = {
		style: PropTypes.object
	}

	state = {}

	listen = (emitter, event, handler) => {
		if (!emitter || !emitter.addEventListener) {
			logger.warn(`Unable to add ${event} event listener to %o`, emitter);
			return;
		}

		emitter.addEventListener(event, handler);
		this.unsubscribe = [
			...(this.unsubscribe || []),
			() => emitter.removeEventListener(event, handler)
		];
	}

	componentDidMount () {
		const {domNode: {current: domNode}} = this;

		if (!domNode) {
			logger.warn('Unable to locate dom node. Bailing.');
			return;
		}

		const scrollParent = getScrollParent(domNode);

		this.listen(scrollParent, 'scroll', this.onScroll);
		this.listen(global, 'resize', this.onResize);

		this.setMinHeight();
	}

	setMinHeight = () => {
		const {
			domNode: {current: domNode},
			state: {aspectRatio: ar}
		} = this;

		const aspectRatio = ar || (
			domNode
				? domNode.offsetHeight / domNode.offsetWidth
				: ASPECT_RATIO
		);

		const minHeight = domNode.offsetWidth * aspectRatio;
		this.setState({minHeight, aspectRatio});
	}

	componentWillUnmount () {
		(this.unsubscribe || []).forEach(fn => fn());
		delete this.unsubscribe;

		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
			delete this.resizeTimeout;
		}
	}

	computePct = (minHeight = this.state.minHeight) => {
		const {
			domNode: {current: domNode}
		} = this;

		if (!domNode) {
			return 1;
		}

		return clamp((minHeight - domNode.offsetTop) / minHeight);
	}

	recompute = () => {
		const {
			state: {aspectRatio: stateAspectRatio, pct: statePct, minHeight: stateMinHeight},
			domNode: {current: domNode}
		} = this;

		const aspectRatio = stateAspectRatio || (
			domNode
				? domNode.offsetHeight / domNode.offsetWidth
				: ASPECT_RATIO
		);

		const minHeight = domNode.offsetWidth * aspectRatio;
		const pct = this.computePct(minHeight);

		const anythingChanged = pct !== statePct || minHeight !== stateMinHeight || aspectRatio !== stateAspectRatio;

		if (anythingChanged) {
			this.setState({
				minHeight,
				pct,
				aspectRatio
			});
		}
	}

	onResize = () => {
		const {
			resizeTimeout
		} = this;

		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
			delete this.resizeTimeout;
		}

		setTimeout(this.recompute, 200);
	}

	onScroll = e => {
		const {
			state: {pct},
		} = this;

		const p = this.computePct();

		if (pct == null || p !== pct) {
			this.setState({pct: p});
		}
	}

	render () {
		const {minHeight, pct = 1} = this.state;

		const style = minHeight ? {
			minHeight: `${minHeight}px`,
			animationDelay: `-${1 - pct}s`
		} : {};

		const props = {
			...this.props,
			style
		};

		return (
			<div ref={this.domNode} className={cx('sticky-popout')}>
				<div {...props} />
			</div>
		);
	}
}
