import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Flyout, Loading} from 'nti-web-commons';

import Store from '../Store';
import {PUBLISHING, RENDER_JOB_CHANGE} from '../Constants';
import {
	publishContentPackage,
	unpublishContentPackage,
	deleteContentPackage,
	cancelRenderJob
} from '../Actions';


const DEFAULT_TEXT = {
	publish: {
		trigger: 'Publish',
		header: 'Ready to Publish?',
		message: 'Make sure to add your reading to a lesson so your students can access it.',
		delete: 'Delete',
		save: 'Publish',
	},
	publishChanges: {
		trigger: 'Publish Changes',
		header: 'Ready to Publish Changes?',
		message: 'Publishing will replace the version of this reading that is visible to students.',
		unpublish: 'Unpublish Reading',
		revert: 'Revert to Published Version',
		delete: 'Delete',
		save: 'Publish'
	},
	publishing: {
		trigger: 'Publishing'
	},
	publishFailed: 'Publish Failed',
	deleteMessage: 'Deleting this reading will remove it and all student activity.'
};

const t = scoped('CONTENT_EDITOR_PUBLISH', DEFAULT_TEXT);

export default class ContentEditorPublish extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object
	}


	setFlyoutRef = x => this.flyoutRef = x

	state = {}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}


	onStoreChange = (data) => {
		const {type} = data;

		if (type === PUBLISHING) {
			this.onPublishChanged();
		} else if (type === RENDER_JOB_CHANGE) {
			this.onRenderJobChanged();
		}
	}


	onPublishChanged () {
		this.setState({
			publishing: Store.isPublishing
		});
	}


	onRenderJobChanged () {
		this.setState({
			renderJob: Store.renderJob
		});
	}


	closeMenu () {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}

	onPublish = () => {
		const {contentPackage} = this.props;

		if (contentPackage) {
			publishContentPackage(contentPackage);
			this.closeMenu();
		}
	}


	onUnpublish = () => {
		const {contentPackage} = this.props;

		if (contentPackage) {
			unpublishContentPackage(contentPackage);
			this.closeMenu();
		}
	}


	onDelete = () => {
		const {contentPackage} = this.props;

		if (contentPackage) {
			deleteContentPackage(contentPackage, t('deleteMessage'));
			this.closeMenu();
		}
	}


	onCancelPublish = () => {
		const {contentPackage} = this.props;
		const {renderJob} = this.state;

		if (renderJob) {
			cancelRenderJob(renderJob, contentPackage);
		}
	}


	render () {
		const trigger = this.renderTrigger();

		return (
			<Flyout ref={this.setFlyoutRef} trigger={trigger} className="content-editor-publish" arrow verticalAlign={Flyout.ALIGNMENTS.TOP} horizontalAlign={Flyout.ALIGNMENTS.RIGHT}>
				{this.renderFlyout()}
			</Flyout>
		);
	}


	renderTrigger () {
		const {contentPackage} = this.props;
		const {disabled, renderJob, publishing} = this.state;
		const {isPublished} = contentPackage || {};
		const isPublishing = (renderJob && renderJob.isPending) || publishing;

		const cls = cx('content-editor-publish-trigger', {
			disabled: disabled || !contentPackage || isPublishing,
			publishing: renderJob && renderJob.isPending,
			failed: renderJob && renderJob.isFailed
		});
		const label = isPublishing ?
							t('publishing.trigger') :
							renderJob && renderJob.isFailed ?
								t('publishFailed') :
								isPublished ? t('publishChanges.trigger') : t('publish.trigger');

		return (
			<div className={cls}>
				{isPublishing ? <Loading.Spinner white size="18px" /> : null}
				<span className="label">{label}</span>
				<i className="icon-chevron-down" />
			</div>
		);
	}


	renderFlyout () {
		const {contentPackage} = this.props;

		return contentPackage && contentPackage.isPublished ?
				this.renderPublished() :
				this.renderDraft();
	}

	renderDraft () {
		return (
			<div className="content-editor-publish-menu not-published">
				<h3>{t('publish.header')}</h3>
				<p>{t('publish.message')}</p>
				<div className="delete" onClick={this.onDelete}>
					<i className="icon-delete" />
					<span>{t('publish.delete')}</span>
				</div>
				<div className="publish" onClick={this.onPublish}>
					<span>{t('publish.save')}</span>
				</div>
			</div>
		);
	}


	renderPublished () {
		return (
			<div className="content-editor-publish-menu published">
				<h3>{t('publishChanges.header')}</h3>
				<p>{t('publishChanges.message')}</p>
				<div className="action" onClick={this.onUnpublish}>{t('publishChanges.unpublish')}</div>
				<div className="delete" onClick={this.onDelete}>
					<i className="icon-delete" />
					<span>{t('publishChanges.delete')}</span>
				</div>
				<div className="publish" onClick={this.onPublish}>
					<span>{t('publishChanges.save')}</span>
				</div>
			</div>
		);
	}
}
