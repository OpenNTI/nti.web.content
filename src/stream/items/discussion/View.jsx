import React from 'react';
import PropTypes from 'prop-types';
import { LuckyCharms, DisplayName, DateTime } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { scoped } from '@nti/lib-locale';

const t = scoped('content.stream.items.note.Detail', {
	duration: '%(duration)s ago'
});

import { Breadcrumb, Avatar } from '../components';
import Registry from '../Registry';

@Registry.register('application/vnd.nextthought.forums.communityheadlinetopic')
class Discussion extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		context: PropTypes.object
	}

	render () {
		const { item, context } = this.props;
		const { creator, title } = item;
		const created = item.getCreatedTime();

		return (
			<div className="stream-discussion">
				{/* <Breadcrumb className="discussion-breadcrumb" item={item} context={context} />
				<div className="discussion-body">
					<LuckyCharms item={item} />
					<div className="discussion-header">
						<Avatar creator={creator} />
						<div className="discussion-meta">
							<div className="title">{title}</div>
							<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
								<DisplayName entity={creator} />
							</LinkTo.Object>
							<div className="created-time">
								{t('duration', { duration: DateTime.getNaturalDuration(Date.now() - created, 1) })}
							</div>
						</div>
					</div>
				</div> */}
			</div>
		);
	}
}

export default Discussion;
