import React from 'react';
import PropTypes from 'prop-types';
import {getScrollParent} from '@nti/lib-dom';
import Logger from '@nti/util-logger';
import classnames from 'classnames/bind';

import styles from './StickyOffsetMonitor.css';

const cx = classnames.bind(styles);
const logger = Logger.get('transcripted-video:sticky-offset-monitor');

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(v, min));

export default function stickyOffsetMonitor (Cmp) {
	class StickyOffsetMonitor extends React.Component {

		constructor (props) {
			super(props);
			this.domNode = React.createRef();
		}

		static propTypes = {
			containerProps: PropTypes.object,
			fwdRef: PropTypes.any
		}

		state = {}

		componentDidMount () {
			const {domNode: {current: domNode}} = this;

			if (!domNode) {
				logger.warn('Unable to locate dom node. Bailing.');
				return;
			}

			const scrollParent = getScrollParent(domNode);
			
			if (!scrollParent || !scrollParent.addEventListener) {
				logger.warn('Unable to identify scrollParent to listen to. scrollParent: %o', scrollParent);
			}
			
			scrollParent.addEventListener('scroll', this.onScroll);
			this.unsubscribe = [...(this.unsubscribe || []), () => scrollParent.removeEventListener(this.onScroll)];

			const initialHeight = domNode.offsetHeight;
			this.setState({initialHeight});
		}

		componentWillUnmount () {
			(this.unsubscribe || []).forEach(fn => fn());
			delete this.unsubscribe;
		}

		onScroll = e => {
			const {
				state: {initialHeight, pct},
				domNode: {
					current: domNode
				},
			} = this;

			if (!domNode) {
				return;
			}

			const p = clamp((initialHeight - domNode.offsetTop) / initialHeight);

			if (pct == null || p !== pct) {
				this.setState({pct: p});
				// onOffsetChange(p, e);
			}
		}

		render () {
			const {
				props: {
					fwdRef,
					containerProps: {
						className,
						...containerProps
					},
					...props
				},
				state: {
					initialHeight,
					pct = 1
				}
			} = this;

			delete props.onOffsetChange;
			
			const cProps = {
				...containerProps,
				className: cx('sticky-popout', className),
				style: {
					minHeight: `${initialHeight}px`,
					animationDelay: `-${1 - pct}s`
				}
			};

			return (
				<div ref={this.domNode} {...cProps}>
					<Cmp {...props} pct={pct} ref={fwdRef} />
				</div>
			);
		}
	}

	return React.forwardRef((props, ref) => <StickyOffsetMonitor {...props} fwdRef={ref} />); //eslint-disable-line react/display-name
}
