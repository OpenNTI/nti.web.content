import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {LuckyCharms, Avatar, DisplayName, DateTime} from '@nti/web-commons';
import {Panel as Body} from '@nti/web-modeled-content';
import {scoped} from '@nti/lib-locale';

const t = scoped('content.stream.items.note.Detail', {
	postedBy: 'Posted by %(name)s'
});

export default class NoteDetils extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			body: PropTypes.any.isRequired,
			isReply: PropTypes.func.isRequired
		}).isRequired
	}

	getDisplayName = (data) => t('postedBy', data)

	render () {
		const {item} = this.props;
		const {body, creator, title, placeholder} = item;
		const created = item.getCreatedTime();
		const isReply = item.isReply();

		return (
			<div className={cx('nti-content-stream-note-details', 'is-reply': isReply)}>
				<LuckyCharms item={item} />
				<div className="title-container">
					<div className="avatar-container">
						<Avatar entity={creator} />
					</div>
					<div className="meta">
						{isReply ? null : (<h1 className="title">{title}</h1>)}
						{isReply ?
							(
								<ul className="reply-name-wrapper">
									<li>
										<DisplayName entity={creator} />
									</li>
									<li>
										<DateTime date={created} relative />
									</li>
								</ul>
							) :
							(
								<ul className="name-wrapper">
									<li>
										<DisplayName entity={creator} localeKey={this.getDisplayName} />
									</li>
									<li>
										<DateTime date={created} relative />
									</li>
								</ul>
							)
						}
					</div>
				</div>
				{!placeholder && (<div className="note-content"><Body body={body} /></div>)}
			</div>
		);
	}
}
