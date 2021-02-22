import './ContentNavMenu.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Flyout } from '@nti/web-commons';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';

const t = scoped('content.navigation.ContentNavMenu', {
	courses: '%(type)ss',
	sections: 'Sections',
	edit: 'Edit %(type)s Information',
	publish: '%(type)s Visibility',
});

class SectionItem extends React.Component {
	static propTypes = {
		section: PropTypes.object.isRequired,
		onClick: PropTypes.func,
	};

	onClick = () => {
		const { section, onClick } = this.props;

		onClick && onClick(section);
	};

	render() {
		const { section } = this.props;

		const className = cx('section', section.cls);

		return (
			<div className={className}>
				<div className="section-title" onClick={this.onClick}>
					{section.title}
				</div>
			</div>
		);
	}
}

class RecentContentItem extends React.Component {
	static propTypes = {
		recentContent: PropTypes.object.isRequired,
		onClick: PropTypes.func,
	};

	attachFlyoutRef = x => (this.flyout = x);

	onClick = () => {
		const { recentContent, onClick } = this.props;

		onClick && onClick(recentContent);
	};

	renderContent() {
		const { recentContent } = this.props;

		return (
			<div className="recent-content" onClick={this.onClick}>
				<img className="content-icon" src={recentContent.thumb} />
			</div>
		);
	}

	render() {
		const { recentContent } = this.props;

		return (
			<Flyout.Triggered
				className="recent-content-trigger"
				trigger={this.renderContent()}
				verticalAlign={Flyout.ALIGNMENTS.TOP}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				ref={this.attachFlyoutRef}
				hover
				arrow
			>
				<div>
					<div className="recent-content-info">
						{recentContent.title}
					</div>
				</div>
			</Flyout.Triggered>
		);
	}
}

const COURSE_TYPE = 'Course';
const BOOK_TYPE = 'Book';

export default class ContentNavMenu extends React.Component {
	static propTypes = {
		activeContent: PropTypes.object,
		recentContentItems: PropTypes.arrayOf(PropTypes.object),
		type: PropTypes.oneOf([COURSE_TYPE, BOOK_TYPE]),
		onItemClick: PropTypes.func,
		onDelete: PropTypes.func,
		onVisibilityChanged: PropTypes.func,
		onEdit: PropTypes.func,
		onPublish: PropTypes.func,
		isAdministrator: PropTypes.bool,
		isEditor: PropTypes.bool,
	};

	static COURSE = COURSE_TYPE;
	static BOOK = BOOK_TYPE;

	constructor(props) {
		super(props);
		this.state = {};
	}

	renderActiveContent() {
		const {
			activeContent,
			isAdministrator,
			isEditor,
			onEdit,
			onPublish,
			onDelete,
			type,
		} = this.props;

		if (!activeContent || !type) {
			return null;
		}

		return (
			<div className="active-content">
				<img className="content-icon" src={activeContent.thumb} />
				<div className="content-info">
					<div className="content-header">
						<div className="title">{activeContent.title}</div>
						{onDelete && isAdministrator ? (
							<div className="delete-content" onClick={onDelete}>
								<i className="icon-delete" />
							</div>
						) : null}
					</div>
					{onEdit && isEditor ? (
						<div className="edit" onClick={onEdit}>
							{t('edit', { type })}
						</div>
					) : null}
					{onPublish && isEditor ? (
						<div className="publish" onClick={onPublish}>
							{t('publish', { type })}
						</div>
					) : null}
				</div>
			</div>
		);
	}

	renderSection = (section, i) => {
		return (
			<SectionItem
				key={section.id || i}
				section={section}
				onClick={this.props.onItemClick}
			/>
		);
	};

	renderSections() {
		const { subItems } = this.props.activeContent || {};

		if (!subItems || subItems.length === 0) {
			return null;
		}

		return (
			<div className="sections">
				<div className="section-label">{t('sections')}</div>
				<div className="sections-list">
					{subItems.map(this.renderSection)}
				</div>
			</div>
		);
	}

	renderRecentContent = (content, i) => {
		return (
			<RecentContentItem
				key={content.id || i}
				recentContent={content}
				onClick={this.props.onItemClick}
			/>
		);
	};

	renderRecentContentItems() {
		const { recentContentItems, type } = this.props;

		if (!recentContentItems || recentContentItems.length === 0) {
			return null;
		}

		return (
			<div className="recent-content-items">
				<div className="section-label">{t('courses', { type })}</div>
				<div className="recent-content-items-list">
					{recentContentItems.map(this.renderRecentContent)}
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="content-nav-menu">
				{this.renderActiveContent()}
				{this.renderSections()}
				{this.renderRecentContentItems()}
			</div>
		);
	}
}
