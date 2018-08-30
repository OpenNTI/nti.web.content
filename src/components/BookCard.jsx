import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {LinkTo} from '@nti/web-routing';

BookCard.propTypes = {
	className: PropTypes.string,
	bundle: PropTypes.object.isRequired
};

export default function BookCard ({className, bundle, ...props}) {
	let {byline, author, title} = bundle || {};

	return (
		<LinkTo.Object object={bundle}>
			<div className={cx('book-card', className)} {...props} >
				<div className="bundle-card-image">
					<div className="bundle-card-image-background" />
				</div>
				<label>
					<h3 className="book-title">{title}</h3>
					<address className="book-author">By {byline || author}</address>
				</label>
			</div>
		</LinkTo.Object>
	);
}
