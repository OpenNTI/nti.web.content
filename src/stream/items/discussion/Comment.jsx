import React from 'react';
import PropTypes from 'prop-types';
import { Like, DisplayName } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { Panel as Body } from '@nti/web-modeled-content';

import { Avatar, Date } from '../components';

class Comment extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			creator: PropTypes.string.isRequired,
			getCreatedTime: PropTypes.func.isRequired,
			body: PropTypes.array
		}).isRequired
	}

	render () {
		const { item, item: { creator, body } } = this.props;
		const date = item.getCreatedTime();

		return (
			<div className="reply stream-reply-item">
				<div className="border" />
				<div className="item-container">
					<Avatar creator={creator} />
					<div className="meta">
						<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
							<DisplayName entity={creator} />
						</LinkTo.Object>
						<Date date={date} />
						<Body className="body" body={body} />
					</div>
					<Like item={item} />
				</div>
			</div>
		);
	}
}

export default Comment;
