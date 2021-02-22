import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { getScrollParent } from '@nti/lib-dom';

import { groupNotesInContent } from '../anchors';

import Styles from './View.css';
import NoteGroup from './NoteGroup';
import ActionWidget from './ActionWidget';

const cx = classnames.bind(Styles);
const getId = x => (x && x.getID ? x.getID() : x);

export default class AnnotationGutter extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		containerId: PropTypes.string,
		disableNoteCreation: PropTypes.bool,
		content: PropTypes.shape({
			querySelectorAll: PropTypes.func,
		}),
		container: PropTypes.shape({
			getBoundingClientRect: PropTypes.func,
		}),
		activeAnchor: PropTypes.object,
		scrolledTo: PropTypes.oneOfType([
			PropTypes.string, // note id
			PropTypes.shape({
				// model
				getID: PropTypes.func.isRequired,
			}),
		]),
		notes: PropTypes.array,
		notesFilter: PropTypes.func,
		setNotesFilter: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.domNode = React.createRef();
	}

	componentDidUpdate() {
		const {
			scrollTargetGroup,
			domNode: { current: domNode },
		} = this;

		if (scrollTargetGroup && domNode) {
			const HEADER_ALLOWANCE = 65;
			const getParentOffset = (child, parent) =>
				child.getBoundingClientRect().top -
				parent.getBoundingClientRect().top +
				parent.scrollTop;
			const scrollParent = getScrollParent(domNode);
			const scrollPos =
				getParentOffset(domNode, scrollParent) +
				scrollTargetGroup.top -
				HEADER_ALLOWANCE;
			scrollParent.scrollTop = scrollPos;
			delete this.scrollTargetGroup;
		}
	}

	onGroupClick = (notes, active) => {
		const { setNotesFilter } = this.props;
		const filter = active ? null : note => (notes || []).includes(note);

		if (setNotesFilter) {
			setNotesFilter(filter);
		}
	};

	render() {
		const {
			className,
			activeAnchor,
			disableNoteCreation,
			content,
			container,
			notes,
		} = this.props;
		const hasNotes = content && notes && notes.length > 0;

		return (
			<div className={cx('gutter', className)} ref={this.domNode}>
				{hasNotes && this.renderNoteGroups(content, container, notes)}
				{activeAnchor &&
					!disableNoteCreation &&
					this.renderActiveAnchor(activeAnchor)}
			</div>
		);
	}

	renderNoteGroups(content, container, notes) {
		const { notesFilter, scrolledTo } = this.props;
		const groups = groupNotesInContent(content, container, notes);

		if (!groups) {
			return null;
		}

		const active = items => notesFilter && items.some(notesFilter);
		const scrollTargetId = getId(scrolledTo);

		return groups.map(group => {
			const { notes: groupNotes, top } = group;

			if (
				scrollTargetId &&
				(groupNotes || []).some(n => getId(n) === scrollTargetId)
			) {
				this.scrollTargetGroup = group;
			}

			return (
				<NoteGroup
					key={top}
					notes={groupNotes}
					active={active(groupNotes)}
					top={top}
					onClick={this.onGroupClick}
				/>
			);
		});
	}

	renderActiveAnchor(anchor) {
		const { containerId } = this.props;

		return <ActionWidget activeAnchor={anchor} containerId={containerId} />;
	}
}
