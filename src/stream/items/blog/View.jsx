import React from 'react';
import PropTypes from 'prop-types';
import {Avatar} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import {Panel} from '../common';
import Registry from '../Registry';

import Meta from './Meta';

export default
@Registry.register('application/vnd.nextthought.forums.personalblogentry')
class BlogItem extends React.Component {

	static propTypes = {
		item: PropTypes.shape({
			getCreatedTime: PropTypes.func.isRequired,
			LikeCount: PropTypes.number,
			PostCount: PropTypes.number,
			getID: PropTypes.func.isRequired,
			creator: PropTypes.string.isRequired
		}).isRequired
	}

	shouldComponentUpdate (nextProps) {
		const { item: nextItem } = nextProps;
		const { item: { title, LikeCount, PostCount }} = this.props;
		if (this.props.item.getID() === nextItem.getID() && title === nextItem.title && LikeCount === nextItem.LikeCount && PostCount === nextItem.PostCount) {
			return false;
		}

		return true;
	}

	render () {
		const {item, item: {title, creator: user}} = this.props;

		return (
			<Panel className="blog-item">
				<LinkTo.Object className="object-link" object={item} context="stream-blog">
					<Avatar entity={user} />
					<div className="title">{title}</div>
					<Meta item={item} />
				</LinkTo.Object>
			</Panel>
		);
	}
}
