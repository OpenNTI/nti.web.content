import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';

export default class AvatarWrap extends React.Component {
	static propTypes = {
		creator: PropTypes.string.isRequired
	}

	render () {
		const { creator } = this.props;
		return (
			<div className="stream-avatar">
				<LinkTo.Object object={{ Username: creator, isUser: true }} context="stream-profile">
					<Avatar entity={creator} />
				</LinkTo.Object>
			</div>
		);
	}
}
