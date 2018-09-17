import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {LinkTo} from '@nti/web-routing';
import {Presentation} from '@nti/web-commons';

BookCard.propTypes = {
	className: PropTypes.string,
	bundle: PropTypes.object.isRequired
};

export default function BookCard ({className, bundle, ...props}) {
	let {byline, author, title} = bundle || {};

	return (
		<LinkTo.Object object={bundle}>
			<div className={cx('book-card', className)} {...props} >
				<Presentation.Asset contentPackage={bundle} type="landing">
					<img className="bundle-card-image" />
				</Presentation.Asset>
				<label>
					<h3 className="book-title">{title}</h3>
					<address className="book-author">By {byline || author}</address>
				</label>
			</div>
		</LinkTo.Object>
	);
}
