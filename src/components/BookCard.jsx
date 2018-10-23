import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';
import {Presentation} from '@nti/web-commons';

//TODO: unify this card component with the course card component

const t = scoped('content.card.Book', {
	byline: 'By %(byline)s',
	preview: 'Preview'
});

BookCard.propTypes = {
	className: PropTypes.string,
	bundle: PropTypes.object.isRequired
};

export default function BookCard ({className, bundle, ...props}) {
	const {byline, author, title} = bundle;

	return (
		<LinkTo.Object object={bundle}>
			<div className={cx('book-card', 'book-card-container', className)} {...props} >
				<Presentation.Asset contentPackage={bundle} type="landing">
					<img className="bundle-card-image" />
				</Presentation.Asset>
				<label>
					<h3 className="book-title">{title}</h3>
					<address className="book-author">{t('byline', {byline: byline || author})}</address>
				</label>
				{!bundle.isPublished() && (
					<ul className="badges">
						<li>
							<div className="preview">
								{t('preview')}
							</div>
						</li>
					</ul>
				)}
			</div>
		</LinkTo.Object>
	);
}
