import React from 'react';
import PropTypes from 'prop-types';
import { LuckyCharms, DisplayName, DateTime } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { scoped } from '@nti/lib-locale';
import { Panel as Body } from '@nti/web-modeled-content';

import { Breadcrumb, Avatar, ItemLinks } from '../components';
import Registry from '../Registry';

import Comment from './Comment';

const t = scoped('content.stream.items.discussion', {
	duration: '%(duration)s ago'
});

@Registry.register('application/vnd.nextthought.forums.communityheadlinetopic')
class Discussion extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			getCreatedTime: PropTypes.func.isRequired,
			creator: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			headline: PropTypes.shape({
				body: PropTypes.array.isRequired
			}).isRequired,
			PostCount: PropTypes.number,
			getID: PropTypes.func.isRequired
		}).isRequired,
		context: PropTypes.object
	}

	state = {
		comments: []
	}

	componentDidMount = () => {
		this.recentComments();
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.item.getID() !== this.props.item.getID()) {
			this.recentComments();
		}
	}

	recentComments = async () => {
		const { item, item: { PostCount } } = this.props;

		if (PostCount > 0 && item.hasLink('Contents')) {
			const { Items } = await item.getContents();
			this.setState({ comments: Items });
		}
	}

	render () {
		const { item, context } = this.props;
		const { comments } = this.state;
		const { creator, title } = item;
		const created = item.getCreatedTime();

		return (
			<div className="stream-discussion">
				<Breadcrumb className="discussion-breadcrumb" item={item} context={context} />
				<div className="item">
					<LuckyCharms item={item} />
					<Avatar creator={creator} />
					<div className="discussion-meta">
						<div className="subject">{title}</div>
						<div className="stamp">
							<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
								<DisplayName entity={creator} />
							</LinkTo.Object>
							<span className="time">
								{t('duration', { duration: DateTime.getNaturalDuration(Date.now() - created, 1) })}
							</span>
						</div>
					</div>
					<Body className="body" body={item.headline && item.headline.body} />
					<ItemLinks item={item} comment={item.PostCount} />
				</div>
				{comments.map(x => <Comment item={x} key={x.getID()} />)}
			</div>
		);
	}
}

export default Discussion;
