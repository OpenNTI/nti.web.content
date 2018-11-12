import React from 'react';
import PropTypes from 'prop-types';
import { DisplayName, Like } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { scoped } from '@nti/lib-locale';
import { Panel as Body } from '@nti/web-modeled-content';
import { getService } from '@nti/web-client';

import { Breadcrumb, Avatar, Date } from '../components';
import Registry from '../Registry';

const t = scoped('content.stream.items.discussion-reply', {
	commented: ' commented on the %(type)s: '
});

const ITEM_MAP = {
	'application/vnd.nextthought.forums.personalblogcomment': 'thought',
	'application/vnd.nextthought.forums.generalforumcomment': 'discussion'
};

@Registry.register('application/vnd.nextthought.forums.generalforumcomment')
@Registry.register('application/vnd.nextthought.forums.personalblogcomment')
class DiscussionReply extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			creator: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			getID: PropTypes.func.isRequired,
			MimeType: PropTypes.string.isRequired
		}).isRequired,
		context: PropTypes.object.isRequired
	}

	state = {
		post: {}
	}

	componentDidMount () {
		this.resolvePost();
	}

	componentDidUpdate (prevProps) {
		if (prevProps.item.getID() !== this.props.item.getID()) {
			this.resolvePost();
		}
	}

	resolvePost = async () => {
		const { item: { href } } = this.props;
		const postRef = href.split('/').slice(0, -1).join('/');
		const service = await getService();
		const post = await service.get(postRef);
		this.setState({ post });
	}

	render () {
		const { item, context } = this.props;
		const { post } = this.state;
		const { creator, body } = item;
		const { title = '' } = post;
		const date = item.getCreatedTime();
		const type = ITEM_MAP[item.MimeType] || 'discussion';
		return (
			<div className="stream-discussion-reply">
				<Breadcrumb className="discussion-reply-breadcrumb" item={item} context={context} />
				<div className="item reply">
					<div className="item-container">
						<Avatar creator={creator} />
						<div className="meta">
							<div className="head">
								<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
									<DisplayName entity={creator} />
								</LinkTo.Object>
								{t('commented', { type })}
								<LinkTo.Object className="discussion-title" object={item} context="discussion">
									{title}
								</LinkTo.Object>
								<Date date={date} />
							</div>
						</div>
						<Like item={item} />
					</div>
					<Body className="body" body={body} />
				</div>
			</div>
		);
	}
}

export default  DiscussionReply;
