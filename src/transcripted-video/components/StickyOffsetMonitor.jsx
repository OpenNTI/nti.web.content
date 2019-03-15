import React from 'react';
import PropTypes from 'prop-types';
import {getScrollParent} from '@nti/lib-dom';
import Logger from '@nti/util-logger';
import classnames from 'classnames/bind';

import style from './StickyOffsetMonitor.css';

const cx = classnames.bind(style);
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
			fwdRef: PropTypes.any,
			onOffsetChange: PropTypes.func
		}

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
			
			this.initialHeight = domNode.offsetHeight;
			scrollParent.addEventListener('scroll', this.onScroll);
			this.unsubscribe = [...(this.unsubscribe || []), () => scrollParent.removeEventListener(this.onScroll)];
		}

		componentWillUnmount () {
			(this.unsubscribe || []).forEach(fn => fn());
			delete this.unsubscribe;
		}

		onScroll = e => {
			const {
				props: {onOffsetChange},
				domNode: {
					current: domNode
				},
				previousPct,
			} = this;

			if (!domNode || !onOffsetChange) {
				return;
			}

			const p = clamp((this.initialHeight - domNode.offsetTop) / this.initialHeight);

			if (previousPct == null || p !== previousPct) {
				this.previousPct = p;
				this.timeout = this.setTimeout(() => onOffsetChange(p, e), 200);
			}
		}

		render () {
			const {
				fwdRef,
				containerProps: {
					className,
					...containerProps
				},
				...props
			} = this.props;

			delete props.onOffsetChange;

			return (
				<div className={cx('sticky-popout', className)} ref={this.domNode} {...containerProps} >
					<Cmp {...props} ref={fwdRef} />
				</div>
			);
		}
	}

	return React.forwardRef((props, ref) => <StickyOffsetMonitor {...props} fwdRef={ref} />);
}
