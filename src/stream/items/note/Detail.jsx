import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {LuckyCharms, Avatar, DisplayName, DateTime} from '@nti/web-commons';
import {Panel as Body} from '@nti/web-modeled-content';
import {scoped} from '@nti/lib-locale';
import { Context } from '@nti/web-discussions';
import { LinkTo } from '@nti/web-routing';
import { getService } from '@nti/web-client';

import {ItemLinks} from '../common';

const t = scoped('content.stream.items.note.Detail', {
	postedBy: 'Posted by %(name)s',
	duration: '%(duration)s ago'
});



export default class NoteDetils extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			body: PropTypes.any.isRequired,
			isReply: PropTypes.func.isRequired,
			creator: PropTypes.string.isRequired,
			inReplyTo: PropTypes.string,
			getID: PropTypes.func.isRequired,
			title: PropTypes.string
		}).isRequired
	}

	state = {
		reply: null
	}

	componentDidMount () {
		this.resolveReply();
	}

	componentDidUpdate (prevProps) {
		if (prevProps.item.getID() !== this.props.item.getID()) {
			this.resolveReply();
		}
	}

	resolveReply = async () => {
		const { item } = this.props;

		if (!item.isReply()) { return; }

		const service = await getService();
		const reply = await service.getObject(item.inReplyTo);
		this.setState({ reply });
	}

	getDisplayName = (data) => t('postedBy', data);

	render () {
		const {item} = this.props;
		const {reply} = this.state;
		const {body, creator, title, placeholder} = item;
		const created = item.getCreatedTime();
		const isReply = item.isReply();
		const other = (reply && reply.creator) || '';

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
							{isReply ?
								(
									<ul className="reply-name-wrapper">
										<li>
											<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
												<DisplayName entity={creator} />
											</LinkTo.Object>
											<span className="replied-to"> replied to </span>
											<LinkTo.Object object={{ Username: other, isUser: true }} context="stream-profile">
												<DisplayName entity={other} />
											</LinkTo.Object>
										</li>
										<li>
											{t('duration', { duration: DateTime.getNaturalDuration(Date.now() - created, 1)})}
										</li>
									</ul>
								) :
								(
									<>
										<h1 className="title">{title}</h1>
										<ul className="name-wrapper">
											<li>
												<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
													<DisplayName entity={creator} localeKey={this.getDisplayName} />
												</LinkTo.Object>
											</li>
											<li>
												{t('duration', { duration: DateTime.getNaturalDuration(Date.now() - created, 1) })}
											</li>
										</ul>
									</>
								)
							}
						</div>
					</div>
					{!placeholder && (<div className="note-content"><Body body={body} /></div>)}
					<ItemLinks item={item} />
				</div>
			</div>
		);
	}
}
