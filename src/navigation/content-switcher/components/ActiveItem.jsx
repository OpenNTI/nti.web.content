import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Presentation} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';
import {scoped} from '@nti/lib-locale';

const t = scoped('content.navigation.content-switcher.ActiveItem', {
	course: {
		edit: 'Edit Course Information',
		publish: 'Course Visibility'
	},
	book: {
		edit: 'Edit Book Information',
		publish: 'Book Visibility'
	},
	section: 'Sections'
});


export default class ContentNavigationSwitcherActiveItem extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			title: PropTypes.string,
			type: PropTypes.string,
			PlatformPresentationResources: PropTypes.array,
			family: PropTypes.array,
			canEdit: PropTypes.bool,
			canDelete: PropTypes.bool,
			canPublish: PropTypes.bool
		}).isRequired
	}

	render () {
		const {item} = this.props;

		return (
			<div className="content-navigation-content-switcher-active-item">
				{this.renderActive(item)}
				{this.renderFamily(item)}
			</div>
		);
	}


	renderActive (item) {
		const getString = (key) => t(`${item.type || 'course'}.${key}`);

		const edition = null; // stubbed out for future support; e.g. '4th Edition';

		return (
			<div className="item">
				<Presentation.Asset contentPackage={item} type="thumb">
					<img className="icon" alt={item.title} />
				</Presentation.Asset>
				<div className="info">
					<div className="header">
						{edition && <div className="edition">{edition}</div>}
						<div className="title">{item.title}</div>
						{item.canDelete &&  (
							<LinkTo.Object className="delete" object={item} context="delete">
								<i className="icon-delete" aria-label="delete"/>
							</LinkTo.Object>
						)}
					</div>
					{item.canEdit && (
						<LinkTo.Object className="edit" object={item} context="edit">
							<span>{getString('edit')}</span>
						</LinkTo.Object>
					)}
					{!item.canEdit && (
						<span className="edit-placeholder" />
					)}
					{item.canPublish && (
						<LinkTo.Object className="publish" object={item} context="publish">
							<span>{getString('publish')}</span>
						</LinkTo.Object>
					)}
				</div>
			</div>
		);
	}


	renderFamily (item) {
		const {family} = item;

		if (!family || !family.length) { return null; }

		return (
			<div className="family">
				<div className="heading">
					{t('section')}
				</div>
				<ul>
					{family.map((fam, index) => {
						return (
							<li key={fam.id || index}>
								<LinkTo.Object
									className={cx('family-item-link', {current: fam.current})}
									object={fam}
								>
									<span>{fam.title}</span>
								</LinkTo.Object>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
