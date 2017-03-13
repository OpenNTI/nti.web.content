import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Flyout, Loading} from 'nti-web-commons';

import Store from '../Store';
import {PUBLISHING, RENDER_JOB_CHANGE} from '../Constants';
import {
	publishContentPackage,
	unpublishContentPackage,
	deleteContentPackage
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
	publishing: 'Publishing',
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


	onRevert = () => {

	}


	onContentPackageChanged = () => {
		this.forceUpdate();
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
		const {disabled, renderJob} = this.state;
		const {isPublished} = contentPackage || {};

		const cls = cx('content-editor-publish-trigger', {
			disabled: disabled || !contentPackage,
			publishing: renderJob && renderJob.isPending,
			failed: renderJob && renderJob.isFailed
		});
		const label = renderJob && renderJob.isPending ?
							t('publishing') :
							renderJob && renderJob.isFailed ?
								t('publishFailed') :
								isPublished ? t('publishChanges.trigger') : t('publish.trigger');

		return (
			<div className={cls}>
				{renderJob && renderJob.isPending ? <Loading.Spinner white size="18px" /> : null}
				<span className="label">{label}</span>
				<i className="icon-chevron-down" />
			</div>
		);
	}


	renderFlyout () {
		const {contentPackage} = this.props;
		const publishChangeActions = [
			{handler: this.onUnpublish, label: t('publishChanges.unpublish')}
			// {handler: this.onRevert, label: t('publishChanges.revert')}
		];

		return contentPackage && contentPackage.isPublished ?
					this.renderMenu(t('publishChanges.header'), t('publishChanges.message'), publishChangeActions, t('publishChanges.delete'), t('publishChanges.save')) :
					this.renderMenu(t('publish.header'), t('publish.message'), [], t('publish.delete'), t('publish.save'));
	}


	renderMenu (header, message, actions, deleteText, save) {
		return (
			<div className="content-editor-publish-menu">
				<h3>{header}</h3>
				<p>{message}</p>
				{actions.map((action, index) => (<div key={index} className="action" onClick={action.handler}>{action.label}</div>))}
				<div className="delete" onClick={this.onDelete}>
					<i className="icon-delete" />
					<span>{deleteText}</span>
				</div>
				<div className="publish" onClick={this.onPublish}>
					<span>{save}</span>
				</div>
			</div>
		);
	}
}
