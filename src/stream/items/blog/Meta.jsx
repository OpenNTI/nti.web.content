import './Meta.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const DEFAULT_TEXT = {
	comments: {
		one: '1 Comment',
		other: '%(count)s Comments'
	},
	likes: {
		one: '1 Like',
		other: '%(count)s Likes'
	}
};

const t = scoped('web-content.blog.meta', DEFAULT_TEXT);

export default class Meta extends React.Component {

	static propTypes = {
		item: PropTypes.object.isRequired
	}

	render () {
		const {
			item,
			item: {
				LikeCount: likes,
				PostCount: comments
			}
		} = this.props;

		const created = item.getCreatedTime();

		return (
			<div className="blog-item-meta">
				<div className="count likes">{t('likes', {count: likes})}</div>
				<div className="count comments">{t('comments', {count: comments})}</div>
				<DateTime date={created} format="MMMM D, YYYY" />
			</div>
		);
	}
}
