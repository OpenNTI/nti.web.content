import React from 'react';
import PropTypes from 'prop-types';
import { LinkTo } from '@nti/web-routing';
import { DisplayName, DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('content.stream.items.note.Detail', {
	postedBy: 'Posted by %(name)s',
	duration: '%(duration)s ago'
});

const getDisplayName = (data) => t('postedBy', data);

export default function Meta ({ item, reply }) {
	const { creator, title } = item;
	const created = item.getCreatedTime();

	return (
		<div className="meta">
			{item.isReply() ?
				(
					<ul className="reply-name-wrapper">
						<li>
							<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
								<DisplayName entity={creator} />
							</LinkTo.Object>
							<span className="replied-to"> replied to </span>
							<LinkTo.Object object={{ Username: reply.creator, isUser: true }} context="stream-profile">
								<DisplayName entity={reply.creator} />
							</LinkTo.Object>
						</li>
						<li>
							<time>{t('duration', { duration: DateTime.getNaturalDuration(Date.now() - created, 1) })}</time>
						</li>
					</ul>
				) :
				(
					<>
						<h1 className="title">{title}</h1>
						<ul className="name-wrapper">
							<li>
								<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
									<DisplayName entity={creator} localeKey={getDisplayName} />
								</LinkTo.Object>
							</li>
							<li>
								<time>{t('duration', { duration: DateTime.getNaturalDuration(Date.now() - created, 1) })}</time>
							</li>
						</ul>
					</>
				)
			}
		</div>
	);
}

Meta.propTypes = {
	item: PropTypes.shape({
		creator: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired
	}).isRequired,
	reply: PropTypes.shape({
		creator: PropTypes.string.isRequired
	})
};
