import React from 'react';
import PropTypes from 'prop-types';
import { parent } from '@nti/lib-dom';
import { DateTime } from '@nti/web-commons';
import Logger from '@nti/util-logger';
import classnames from 'classnames/bind';

import { padTimeString } from '../util';

import styles from './TranscriptChunk.css';
import Cue from './Cue';
import CueStyles from './Cue.css';

const cx = classnames.bind(styles);
const logger = Logger.get('transcripted-video:transcript-chunk');
const ALL_CUES_QUERY = `.${CueStyles.cue}`; // querySelector for cue nodes
// const SLIDE_CUES_QUERY = `.${CueStyles.slide}`; // querySelector for slide nodes
const VTT_CUES_QUERY = `${ALL_CUES_QUERY}:not([data-cue-id])`; // querySelector for vtt (non-slide) nodes
const MOUSE_MOVE_THROTTLE = 200;

const cueClassPrefix = (cue = {}) =>
	'text' in cue ? 'cue' : 'image' in cue ? 'slide' : 'unknown';

export default class TranscriptChunk extends React.Component {
	static propTypes = {
		start: PropTypes.number, // chunk start time in seconds
		end: PropTypes.number, // chunk end time in seconds
		currentTime: PropTypes.number,
		cues: PropTypes.array,
		notes: PropTypes.array,
		notesFilter: PropTypes.func,
		onCueClick: PropTypes.func,
		onNoteGroupClick: PropTypes.func,
		video: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.container = React.createRef();
	}

	state = {};

	componentWillUnmount() {
		(this.unsubscribe || []).forEach(fn => fn());
		delete this.unsubscribe;

		this.clearTimeouts();
	}

	componentDidMount() {
		this.addMouseListeners();

		// we need the cues to be mounted in the dom before we attempt to compute
		// positions for the gutter's markers. using this to indicate we're ready
		// for dom queries.
		this.setState({ mounted: true });
	}

	addMouseListeners() {
		const {
			container: { current: domNode },
		} = this;

		if (!domNode) {
			logger.warn(
				'Unable to add mouse listeners. DOM container unavailable.'
			);
			return;
		}

		const handlers = {
			mousemove: this.onMouseMove,
			mouseleave: this.onMouseLeave,
		};

		Object.entries(handlers).forEach(([event, handler]) => {
			domNode.addEventListener(event, handler);
			this.unsubscribe = [
				...(this.unsubscribe || []),
				() => domNode.removeEventListener(event, handler),
			];
		});
	}

	clearTimeouts = () => {
		const { mouseMovedTimeout } = this;

		if (mouseMovedTimeout) {
			clearTimeout(mouseMovedTimeout);
			delete this.mouseMovedTimeout;
		}
	};

	onMouseLeave = () => {
		this.clearTimeouts();
		this.clearActionInfo();
	};

	clearActionInfo = () => {
		this.setState({
			actionTime: undefined,
			actionCueId: undefined,
			actionTop: undefined,
		});
	};

	onMouseMove = ({ clientY, currentTarget, target }) => {
		this.clearTimeouts();
		this.mouseMovedTimeout = setTimeout(
			() => this.mouseMoveHandler(clientY, currentTarget, target),
			MOUSE_MOVE_THROTTLE
		);
	};

	mouseMoveHandler = (clientY, currentTarget, target) => {
		const offsetY = clientY - currentTarget.getBoundingClientRect().top;
		const {
			actionTime = {},
			actionCueId: oldCueId,
			actionTop: oldTop,
		} = this.state;
		const elementWithRange = e =>
			parent(e, '[data-start-time][data-end-time]');
		const {
			dataset: { startTime, endTime, cueId } = {},
			offsetTop: actionTop,
		} = elementWithRange(target) || this.findCueNodeAtY(offsetY) || {};

		if (startTime == null) {
			this.clearActionInfo();
			return;
		}

		const start = parseFloat(startTime);
		const end = parseFloat(endTime);

		if (
			start !== actionTime.start ||
			end !== actionTime.end ||
			actionTop !== oldTop ||
			cueId !== oldCueId
		) {
			this.setState({
				actionTime: { start, end },
				actionCueId: cueId,
				actionTop,
			});
		}
	};

	/**
	 * Given a y coordinate in local DOM space, attempts to locate a cue node on that line.
	 * Used to inform the add-note widget about the start/end time and its positioning in the gutter
	 * @param {int} y - The Y coordinate in local DOM space
	 * @returns {DOMNode} - A dom node representing a cue at the given Y coordinate
	 */
	findCueNodeAtY = y => {
		const {
			container: { current: container },
		} = this;

		if (!container) {
			return;
		}

		// snap the coordinate to the vertical center of the corresponding line
		const lineHeight = parseInt(
			global.getComputedStyle(container).lineHeight,
			10
		);
		const snapped =
			Math.floor(y / lineHeight) * lineHeight + lineHeight / 2;

		// prefer a cue entirely on this line
		const byLineHeight = node =>
			node.offsetTop < snapped && node.offsetTop + lineHeight > snapped;

		// fallback to a cue that's at least partially on this line.
		// this will cause the add-note control to appear on the line
		// where the cue begins, which may occur before the specified
		// y coordinate.
		const byOffsetHeight = node => {
			const { offsetTop: top, offsetHeight: height } = node;
			return top < snapped && top + height > snapped;
		};

		const findCue = nodes =>
			nodes.find(byLineHeight) || nodes.find(byOffsetHeight);

		return (
			container.querySelector(`${ALL_CUES_QUERY}:hover`) || // hovered on a cue? return that.
			findCue(Array.from(container.querySelectorAll(ALL_CUES_QUERY)))
		); // otherwise look for one on the same y plane
	};

	getVerticalPositionForTime = (start, end) => {
		const {
			container: { current },
		} = this;

		if (!current) {
			throw new Error('DOM not ready?');
		}

		const timeIn = ({ dataset: { startTime, endTime } }) => {
			const cueStart = parseFloat(startTime);
			const cueEnd = parseFloat(endTime);

			if (!end) {
				return start >= cueStart && start <= cueEnd;
			}

			return (
				start.isFloatLessThanOrEqual(cueStart) &&
				end.isFloatLessThanOrEqual(cueEnd)
			);
		};

		const node = Array.from(current.querySelectorAll(VTT_CUES_QUERY)).find(
			timeIn
		);

		if (!node) {
			throw new Error("Couldn't find relevant node for the given time.");
		}

		return node.offsetTop;
	};

	getVerticalPositionForCue = cue => {
		const {
			container: { current },
		} = this;

		if (!current) {
			throw new Error('DOM not ready?');
		}

		if (cue && cue.getID()) {
			const node = current.querySelector(
				`[data-cue-id="${cue.getID()}"]`
			);

			if (node) {
				return node.offsetTop;
			}
		}

		throw new Error("Couldn't find relevant node for the given cue.");
	};

	render() {
		const {
			props: {
				start: chunkStart,
				end: chunkEnd,
				cues,
				currentTime: time,
				onCueClick,
			},
		} = this;

		const isActive = (start, end) => start < time && time <= end;
		// || (actionTime && start <= actionTime.start && end >= actionTime.end);

		// the time string displayed at the start of the chunk, e.g. '04:23'
		const chunkStartString = padTimeString(
			DateTime.formatDuration(chunkStart)
		);
		const active = isActive(chunkStart, chunkEnd);

		return (
			<li
				key={`chunk-${chunkStartString}`}
				className={cx('chunk', { active })}
				ref={this.container}
			>
				<div className={cx('chunk-start-time')}>
					<span>{chunkStartString}</span>
				</div>
				<p className={cx('cues')}>
					{cues.map(cue => (
						<Cue
							key={`${cueClassPrefix(cue)}-${cue.startTime}-cue`}
							active={isActive(cue.startTime, cue.endTime)}
							onClick={onCueClick}
							cue={cue}
						/>
					))}
				</p>
			</li>
		);
	}
}
