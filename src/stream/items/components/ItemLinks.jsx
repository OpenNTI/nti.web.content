import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getAppUsername } from '@nti/web-client';
import { Prompt } from '@nti/web-commons';

const { areYouSure } = Prompt;

const DEFAULT_TEXT = {
	comments: {
		one: '1 Comment',
		other: '%(count)s Comments'
	},
	edit: 'Edit',
	delete: 'Delete',
	deleteMessage: 'The following action will delete your item.'
};

const t = scoped('web-content.ContentOptionsSwitcher', DEFAULT_TEXT);

export default class ItemLinks extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			ReferencedByCount: PropTypes.number,
			hasLink: PropTypes.func.isRequired,
			delete: PropTypes.func.isRequired
		}).isRequired
	}

	onDelete = async () => {
		try {
			await areYouSure(t('deleteMessage'));
			await this.props.item.delete();
		} catch (error) {
			// we don't care about aborted areYouSure
		}
	}

	render () {
		const { item } = this.props;
		const { ReferencedByCount: comment, creator } = item;
		const appuser = getAppUsername();
		const isMe = appuser === creator;

		return (
			<div className="item-links">
				<div className="comments">{t('comments', { count: comment })}</div>
				{isMe && (
					<>
						<div className="edit">Edit</div>
						<div className="delete" onClick={this.onDelete}>Delete</div>
					</>
				)}
			</div>
		);
	}
}
