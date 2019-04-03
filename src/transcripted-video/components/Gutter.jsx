import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Logger from '@nti/util-logger';

import styles from './Gutter.css';
import {ActionWidget} from './ActionWidget';
import {NoteGroup} from './NoteGroup';

const cx = classnames.bind(styles);
const logger = Logger.get('transcripted-video.gutter');
const noop = () => {};

export default class Gutter extends React.Component {
	static propTypes = {
		cues: PropTypes.array,
		notes: PropTypes.array,
		notesFilter: PropTypes.func,
		onGroupClick: PropTypes.func,
		yForCue: PropTypes.func,
		yForTime: PropTypes.func,
		actionInfo: PropTypes.shape({
			time: PropTypes.shape({
				start: PropTypes.number.isRequired,
				end: PropTypes.number.isRequired
			}),
			top: PropTypes.number
		})
	}

	constructor (props) {
		super(props);
		this.timeouts = {};
	}

	componentDidMount () {
		global.addEventListener('resize', this.onResize);
		this.unsubscribe = [() => global.removeEventListener('resize', this.onResize)];
	}

	componentWillUnmount () {
		(this.unsubscribe || []).forEach(fn => fn());
		delete this.unsubscribe;
	}

	onResize = () => {
		const {resizeTimeout} = this.timeouts;

		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}

		this.timeouts.resizeTimeout = setTimeout(() => this.forceUpdate(), 200);
	}

	onGroupClick = (notes, active) => {
		const {onGroupClick} = this.props;

		if (onGroupClick) {
			onGroupClick(notes, active);
		}
	}

	getYForNote = note => {
		const {cues, yForTime, yForCue = noop} = this.props;

		try {
			const {start} = this.getRangeFor(note);
			const {ContainerId: containerId} = note;
			const cue = containerId ? (cues || []).find(c => c.getID && c.getID() === containerId) : null;
	
			return cue
				? yForCue(cue) // throws if parent dom isn't available or if it can't find the position
				: start != null
					? yForTime(start) // throws if parent dom isn't available or if it can't find the position
					: null;
		}
		catch (e) {
			logger.warn(e);
		}
	}

	/**
	 * Attempts to extract the start and end time from the note's applicableRange property.
	 * Some notes, like those attached to slides, won't have start/end times.
	 * @see getRangeFor
	 * @see getRangeFromCue
	 * @returns {Object} an object with start and end properties, which may be empty.
	 */
	getRangeFromNote = ({
		applicableRange: {
			start: {seconds: start} = {},
			end: {seconds: end = start} = {}
		} = {}
	}) => start != null ? ({start, end}) : null;

	/**
	 * Attempts to locate and extract the start and end time from a cue representing a note's container (e.g. a Slide).
	 * Notes attached to Slides (for example) may have a ContainerId matching a corresponding cue, which in turn may
	 * be able to tell us the applicable range.
	 * @see getRangeFor
	 * @see getRangeFromNote
	 * @returns {Object} an object with start and end properties, which may be empty.
	 */
	getRangeFromCue = ({ContainerId: containerId}) => {
		const {cues} = this.props;
		const {startTime: start, endTime: end} = (cues || []).find(cue => cue.getID && cue.getID() === containerId) || {};
		return start != null ? {start, end} : null;
	}

	getRangeFor = note => {
		const {start, end} = this.getRangeFromNote(note) || this.getRangeFromCue(note);
		return {start, end};
	}

	renderNoteGroups () {
		const {
			notes,
			notesFilter,
			yForCue,
			yForTime
		} = this.props;

		if (!notes || (!yForCue && !yForTime)) {
			return null;
		}
		
		// group notes according to vertical position of the corresponding cue in the transcript
		const bins = notes.reduce((acc, note) => {
			try {
				const y = this.getYForNote(note);

				if (y == null) {
					return;
				}

				const key = `${y}px`;

				// create the bin if doesn't already exist
				const {start, end} = this.getRangeFor(note);
				acc[key] = acc[key] || {notes: [], range: {start, end}};

				// append the current note to the bin
				acc[key].notes.push(note);

				// update the bin's bounding time range. the range is used for the react key
				// to allow re-renders from resize events to use the same instance so we can
				// animate the position with css.
				acc[key].range = {
					start: Math.min(acc[key].range.start, start),
					end: Math.max(acc[key].range.end, end),
				};
			}
			catch (e) {
				logger.error(e);
			}
			return acc;
		}, {});
		
		// this sort is not strictly necessary, but it causes the groups to be
		// rendered into the dom in ascending y-position order, as one might expect
		const sort = ([topA], [topB]) => parseInt(topA, 10) - parseInt(topB, 10);

		const active = items => notesFilter && items.some(notesFilter);

		return (
			Object.entries(bins || {}).sort(sort).map(([top, {notes: items, range: {start, end}}]) => (
				<NoteGroup onClick={this.onGroupClick} key={`${start}-${end}`} notes={items} style={{top}} active={active(items)} />
			))
		);
	}

	renderActionWidget () {
		const {yForTime, actionInfo: {time: {start} = {}, top: actionTop} = {}} = this.props;

		if (!actionTop && (start == null || !yForTime)) {
			return null;
		}

		try {
			const top = (actionTop != null ? actionTop : yForTime(start)) + 'px';
			return (
				<ActionWidget style={{top}} />
			);
		}
		catch (e) {
			logger.error(e);
		}
	}

	render () {
		return (
			<div className={cx('gutter')}>
				{this.renderNoteGroups()}
				{this.renderActionWidget()}
			</div>
		);
	}
}

