import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Flyout, Loading, HOC} from 'nti-web-commons';

import Store from '../Store';
import {PUBLISHING, RENDER_JOB_CHANGE, SET_ERROR} from '../Constants';
import {
	publishContentPackage,
	unpublishContentPackage,
	deleteContentPackage,
	cancelRenderJob
} from '../Actions';


const {ItemChanges} = HOC;

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
	publishFailed: {
		trigger: 'Publish Failed'
	}
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
		const {contentPackage} = this.props;
		const {type, NTIID} = data;

		if (type === PUBLISHING) {
			this.onPublishChanged();
		} else if (type === RENDER_JOB_CHANGE) {
			this.onRenderJobChanged();
		} else if (type === SET_ERROR && (NTIID === contentPackage.NTIID || NTIID === contentPackage.OID)) {
			this.onPublishError();
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


	onPublishError () {
		const {contentPackage} = this.props;
		const error = Store.getErrorFor(contentPackage.NTIID, 'publish') || Store.getErrorFor(contentPackage.OID, 'publish');

		this.setState({error});
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
			deleteContentPackage(contentPackage);
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


	onContentPackageChange = () => {
		this.forceUpdate();
	}


	render () {
		const {contentPackage} = this.props;
		const trigger = this.renderTrigger();

		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onContentPackageChange}>
				<Flyout.Triggered ref={this.setFlyoutRef} trigger={trigger} className="content-editor-publish" arrow verticalAlign={Flyout.ALIGNMENTS.TOP} horizontalAlign={Flyout.ALIGNMENTS.RIGHT}>
					{this.renderFlyout()}
				</Flyout.Triggered>
			</ItemChanges>
		);
	}


	renderTrigger () {
		const {contentPackage} = this.props;
		const {disabled, renderJob, publishing, error} = this.state;
		const {isPublished} = contentPackage || {};
		const isPublishing = (renderJob && renderJob.isPending) || publishing;
		const isFailed = (renderJob && renderJob.isFailed) || error;

		const cls = cx('content-editor-publish-trigger', {
			disabled: disabled || !contentPackage || isPublishing,
			publishing: isPublishing,
			failed: isFailed
		});
		const label = isPublishing ?
							t('publishing.trigger') :
							isFailed ?
								t('publishFailed.trigger') :
								isPublished ? t('publishChanges.trigger') : t('publish.trigger');

		return (
			<div className={cls}>
				{isPublishing ? (<Loading.Spinner white size="18px" />) : null}
				{isFailed ? (<i className="icon-alert alert" />) : null}
				<span className="label">{label}</span>
				<i className="icon-chevron-down menu" />
			</div>
		);
	}


	renderFlyout () {
		const {contentPackage} = this.props;
		const {error} = this.state;

		return contentPackage && contentPackage.isPublished ?
				this.renderPublished(error) :
				this.renderDraft(error);
	}

	renderDraft (error) {
		return (
			<div className="content-editor-publish-menu not-published">
				{error && (<div className="error">{error.message || error}</div>)}
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


	renderPublished (error) {
		return (
			<div className="content-editor-publish-menu published">
				{error && (<div className="error">{error.message || error}</div>)}
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
