import React from 'react';
import PropTypes from 'prop-types';
import { DisplayName, DateTime, Like } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { scoped } from '@nti/lib-locale';
import { Panel as Body } from '@nti/web-modeled-content';
import { getService } from '@nti/web-client';

import { Breadcrumb, Avatar } from '../components';
import Registry from '../Registry';

const t = scoped('content.stream.items.discussion-reply', {
	commented: ' commented on the discussion: '
});

@Registry.register('application/vnd.nextthought.forums.generalforumcomment')
class DiscussionReply extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			creator: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			getID: PropTypes.func.isRequired
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
								{t('commented')}
								<LinkTo.Object className="discussion-title" object={item} context="discussion">
									{title}
								</LinkTo.Object>
								<time>{DateTime.format(date, 'MMMM D, YYYY')}</time>
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
