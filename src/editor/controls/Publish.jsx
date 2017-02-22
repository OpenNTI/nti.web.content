import React from 'react';
import {scoped} from 'nti-lib-locale';
import {Flyout, PublishTrigger} from 'nti-web-commons';

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
	}
};

const t = scoped('CONTENT_EDITOR_PUBLISH', DEFAULT_TEXT);

export default class ContentEditorPublish extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object
	}

	onPublish = () => {
		debugger;
	}


	onUnpublish = () => {

	}


	onDelete = () => {

	}


	onRevert = () => {

	}


	render () {
		const trigger = this.renderTrigger();

		return (
			<Flyout trigger={trigger} className="content-editor-publish" arrow verticalAlign={Flyout.ALIGNMENTS.TOP} horizontalAlign={Flyout.ALIGNMENTS.RIGHT}>
				{this.renderFlyout()}
			</Flyout>
		);
	}


	renderTrigger () {
		return (
			<div>
				<PublishTrigger label={t('publish.trigger')} />
			</div>
		);
	}


	renderFlyout () {
		const {contentPackage} = this.props;
		const publishChangeActions = [
			{handler: this.onUnpublish, label: t('publishChanges.unpublish')},
			{handler: this.onRevert, label: t('publishChanges.revert')}
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
				<div className="delete">
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
