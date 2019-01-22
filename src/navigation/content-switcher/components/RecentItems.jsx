import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Presentation, Flyout} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

const t = scoped('content.navigation.content-switcher.RecentItems', {
	course: {
		label: 'Courses'
	},
	book: {
		label: 'Books'
	}
});

export default class ContentNavigationSwitcherRecentItems extends React.Component {
	static propTypes = {
		items: PropTypes.arrayOf(
			PropTypes.shape({
				title: PropTypes.string,
				PlatformPresentationResources: PropTypes.array,
				type: PropTypes.string
			})
		)
	}

	render () {
		const {items} = this.props;

		if (!items || !items.length) { return null; }

		const groups = items.reduce((acc, item) => {
			const {type} = item;

			if (!acc[type]) { acc[type] = []; }

			acc[type].push(item);

			return acc;
		}, {});
		const names = Object.keys(groups).sort().reverse();

		return (
			<div className="content-navigation-switcher-recent-items">
				{names.map((name) => this.renderGroup(name, groups[name]))}
			</div>
		);
	}


	renderGroup (name, items) {
		return (
			<div className="group" key={name}>
				<div className="heading">
					{t(`${name}.label`)}
				</div>
				<ul>
					{items.map((item, key) => {
						return (
							<li key={item.id || key}>
								{this.renderItem(item)}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}


	renderItem (item) {
		const trigger = (
			<LinkTo.Object className="content-navigation-switcher-recent-item" object={item}>
				<Presentation.Asset contentPackage={item} type="thumb">
					<img className="icon" />
				</Presentation.Asset>
			</LinkTo.Object>
		);

		return (
			<Flyout.Triggered
				className="content-navigation-switcher-recent-item-flyout"
				trigger={trigger}
				verticalAlign={Flyout.ALIGNMENTS.TOP}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				dark
				hover
				arrow
			>
				<div>
					<div className="content-navigation-switcher-recent-item-info">
						{item.title}
					</div>
				</div>
			</Flyout.Triggered>

		);
	}
}