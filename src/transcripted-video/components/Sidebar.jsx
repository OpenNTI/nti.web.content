import React from 'react';
import PropTypes from 'prop-types';
import {Layouts} from '@nti/web-commons';
import {Hooks, Events} from '@nti/web-session';
import {decodeFromURI} from '@nti/lib-ntiids';
import {Notes} from '@nti/web-discussions';

import Store from '../Store';

export default
@Store.monitor([
	'notes',
	'onNoteAdded',
	'onNoteDeleted',
	'notesFilter'
])
@Hooks.onEvent({
	[Events.NOTE_CREATED]: 'onNoteCreated',
	[Events.NOTE_DELETED]: 'onNoteDeleted'
})
class Sidebar extends React.Component {

	static deriveBindingFromProps = ({course, videoId, outlineId}) => ({
		course,
		videoId: decodeFromURI(videoId),
		outlineId: decodeFromURI(outlineId)
	})

	static propTypes = {
		// store props
		notes: PropTypes.array,
		onNoteAdded: PropTypes.func,
		onNoteDeleted: PropTypes.func,
		notesFilter: PropTypes.func,
	}

	onNoteCreated (note) {
		const {onNoteAdded} = this.props;

		if (onNoteAdded) {
			onNoteAdded(note);
		}
	}


	onNoteDeleted (note) {
		const {onNoteDeleted} = this.props;

		if (onNoteDeleted) {
			onNoteDeleted(note);
		}
	}

	render () {
		const {
			notes,
			notesFilter,
		} = this.props;

		const filteredNotes = notes && notesFilter ? notes.filter(notesFilter) : notes;

		return (
			<Layouts.Aside component={Notes.Sidebar} notes={filteredNotes} fillToBottom sticky />
		);
	}
}
