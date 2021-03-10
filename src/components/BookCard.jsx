import './BookCard.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { Presentation, Hooks } from '@nti/web-commons';

//TODO: unify this card component with the course card component

const { useListItemVariant } = Hooks;

const VARIANTS = {
	LIST: 'list-item',
	CARD: 'card',
	AUTO: 'auto',
};

const ASSETS = {
	[VARIANTS.LIST]: 'thumb', // we *might* need to remove this or switch it to 'landing'. the bundle i'm testing with has a 60x60 thumbnail and we're displaying these at 90x90.
};

const t = scoped('content.card.Book', {
	byline: 'By %(byline)s',
	preview: 'Preview',
});

BookCard.propTypes = {
	className: PropTypes.string,
	bundle: PropTypes.object.isRequired,
	variant: PropTypes.oneOf(['card', 'list-item']),
};

export default function BookCard({
	className,
	bundle,
	variant: v = 'auto',
	...props
}) {
	const { byline, author, title } = bundle;
	const edition = null; // waiting server support; '4th Edition';
	const variant = useListItemVariant(v);

	return (
		<LinkTo.Object object={bundle} data-testid="book-card">
			<div
				className={cx(
					'book-card',
					'book-card-container',
					className,
					variant
				)}
				{...props}
			>
				<Presentation.Asset
					contentPackage={bundle}
					type={ASSETS[variant] ?? 'landing'}
				>
					<img className="bundle-card-image" />
				</Presentation.Asset>
				<label className="book-card-label">
					{edition && <div className="book-edition">{edition}</div>}
					<h3 className="book-title">{title}</h3>
					<address className="book-author">
						{t('byline', { byline: byline || author })}
					</address>
				</label>
				{!bundle.isPublished() && (
					<ul className="badges">
						<li>
							<div className="preview">{t('preview')}</div>
						</li>
					</ul>
				)}
			</div>
		</LinkTo.Object>
	);
}
