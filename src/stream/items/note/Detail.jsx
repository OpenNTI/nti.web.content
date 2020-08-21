import './Detail.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {LuckyCharms, Avatar, DisplayName, DateTime} from '@nti/web-commons';
import {Viewer as Body} from '@nti/web-modeled-content';
import {scoped} from '@nti/lib-locale';
import { Context } from '@nti/web-discussions';
import { LinkTo } from '@nti/web-routing';

const t = scoped('content.stream.items.note.Detail', {
	postedBy: 'Posted by %(name)s'
});

export default class NoteDetils extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			body: PropTypes.any.isRequired,
			isReply: PropTypes.func.isRequired,
			getCreatedTime: PropTypes.func.isRequired,
			creator: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			placeholder: PropTypes.any.isRequired,
		}).isRequired
	}

	getDisplayName = (data) => t('postedBy', data)

	render () {
		const {item} = this.props;
		const {body, creator, title, placeholder} = item;
		const created = item.getCreatedTime();
		const isReply = item.isReply();

		return (
			<div className={cx('nti-content-stream-note-details', {'is-reply': isReply})}>
				<LinkTo.Object object={item} context="stream-context">
					<div className="context">
						<Context item={item} />
					</div>
				</LinkTo.Object>
				<div className="detail">
					<div className="title-container">
						<LuckyCharms item={item} />
						<div className="avatar-container">
							<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
								<Avatar entity={creator} />
							</LinkTo.Object>
						</div>
						<div className="meta">
							{isReply ? null : (<h1 className="title">{title}</h1>)}
							{isReply ?
								(
									<ul className="reply-name-wrapper">
										<li>
											<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
												<DisplayName entity={creator} />
											</LinkTo.Object>
										</li>
										<li>
											<DateTime date={created} relative />
										</li>
									</ul>
								) :
								(
									<ul className="name-wrapper">
										<li>
											<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
												<DisplayName entity={creator} localeKey={this.getDisplayName} />
											</LinkTo.Object>
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
			</div>
		);
	}
}
