import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {groupNotesInContent} from '../anchors';

import Styles from './View.css';
import NoteGroup from './NoteGroup';

const cx = classnames.bind(Styles);

export default class AnnotationGutter extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		content: PropTypes.shape({
			querySelectorAll: PropTypes.func
		}),
		container: PropTypes.shape({
			getBoundingClientRect: PropTypes.func
		}),

		notes: PropTypes.array,
		notesFilter: PropTypes.func,
		setNotesFilter: PropTypes.func
	}


	onGroupClick = (notes, active) => {
		const {setNotesFilter} = this.props;
		const filter = active ? null : (note => (notes || []).includes(note));

		if (setNotesFilter) {
			setNotesFilter(filter);
		}
	}


	render () {
		const {className, content, container, notes} = this.props;

		return (
			<div className={cx('gutter', className)}>
				{content && notes && notes.length && this.renderNoteGroups(content, container, notes)}
			</div>
		);
	}


	renderNoteGroups (content, container, notes) {
		const {notesFilter} = this.props;
		const groups = groupNotesInContent(content, container, notes);

		if (!groups) { null; }

		const active = items => notesFilter && items.some(notesFilter);

		return (
			groups.map((group) => {
				const {notes:groupNotes, top} = group;

				return (
					<NoteGroup
						key={top}
						notes={groupNotes}
						active={active(groupNotes)}
						top={top}
						onClick={this.onGroupClick}
					/>
				);
			})
		);
	}
}
