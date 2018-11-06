import React from 'react';
import PropTypes from 'prop-types';
import { LuckyCharms, DisplayName, DateTime } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { scoped } from '@nti/lib-locale';
import { Panel as Body } from '@nti/web-modeled-content';

const t = scoped('content.stream.items.discussion', {
	duration: '%(duration)s ago'
});

import { Breadcrumb, Avatar } from '../components';
import Registry from '../Registry';

@Registry.register('application/vnd.nextthought.forums.communityheadlinetopic')
class Discussion extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			getCreatedTime: PropTypes.func.isRequired,
			creator: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			headline: PropTypes.shape({
				body: PropTypes.array.isRequired
			}).isRequired
		}).isRequired,
		context: PropTypes.object
	}

	render () {
		const { item, context } = this.props;
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
				</div>
			</div>
		);
	}
}

export default Discussion;
