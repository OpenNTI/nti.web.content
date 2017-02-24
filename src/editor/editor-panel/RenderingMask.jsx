import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Sequence, Loading} from 'nti-web-commons';

import {PUBLISHING} from '../Constants';
import Store from '../Store';

const DEFAULT_TEXT = {
	publishingMessageOne: 'Publishing...',
	publishingMessageTwo: 'This may take a moment...',
	publishingMessageThree: {
		message: 'We are experiencing a high volume of submissions. Your reading was added to a queue. Please come back later.',
		button: 'Okay'
	},
	successMessage: 'Successfully Published!',
	failureMessage: 'Failed To Publish.'
};

const t = scoped('CONTENT_EDITOR_RENDERING_MASK', DEFAULT_TEXT);

export default class ContentEditorRenderingMask extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		onSuccessfulPublish: React.PropTypes.func,
		onFailureFinish: React.PropTypes.func
	}

	state = {
		publising: true
	}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		this.cleanUp();
		Store.removeChangeListener(this.onStoreChange);
	}


	getRenderJob (props = this.props) {
		const {contentPackage} = props;
		const {LatestRenderJob} = contentPackage || {};

		return LatestRenderJob;
	}


	cleanUp () {
		if (this.renderJob) {
			this.renderJob.stopMonitor();
			this.renderJob.removeListener('change', this.onRenderJobChange);
		}
	}


	onStoreChange = (data) => {
		const {type} = data;

		if (type === PUBLISHING) {
			this.onPublish();
		}
	}


	onRenderJobChange = (job) => {
		const {publishing} = this.state;
		let state = {
			failed: job.isFailed,
			success: job.isSucess
		};

		if (publishing !== job.isPending) {
			state.publishing = job.isPending;
		}

		this.setState(state);
	}


	onPublish () {
		if (Store.isPublishing) {
			this.setState({
				publishing: true
			});
		} else {
			this.onPublishEnded();
		}
	}


	onPublishEnded () {
		this.renderJob = this.getRenderJob();

		this.renderJob.addListener('change', this.onRenderJobChange);
		this.renderJob.startMonitor();

		this.onRenderJobChange(this.renderJob);
	}


	onSuccessFinish = () => {
		const {onSuccessfulPublish} = this.props;

		if (onSuccessfulPublish) {
			onSuccessfulPublish();
		} else {
			this.setState({
				publishing: false,
				success: false,
				failure: false
			});
		}
	}


	onFailureFinish = () => {
		const {onFailureFinish} = this.props;

		if (onFailureFinish) {
			onFailureFinish();
		} else {
			this.setState({
				publishing: false,
				success: false,
				failure: false
			});
		}
	}


	onPublishDismiss = () => {
		this.setState({
			publishing: false,
			success: false,
			failure: false
		});
	}


	render () {
		const {publishing, success, failure} = this.state;
		const cls = cx('content-editor-render-mask', {publishing, success, failure});

		return (
			<div className={cls}>
				{publishing ? this.renderPublishing() : null}
				{success ? this.renderSuccess() : null}
				{failure ? this.renderFailure() : null}
			</div>
		);
	}

	renderPublishing = () => {
		return (
			<div className="publishing-indicator">
				<Sequence.Timed>
					<Sequence.Item showFor={9000}>
						<div className="spinner-message">
							<Loading.Spinner className="spinner" size="120px" strokeWidth="1" />
							<span className="spinner-message">{t('publishingMessageOne')}</span>
						</div>
					</Sequence.Item>
					<Sequence.Item showFor={12000}>
						<div className="spinner-message">
							<Loading.Spinner className="spinner" size="120px" strokeWidth="1" />
							<span className="spinner-message">{t('publishingMessageTwo')}</span>
						</div>
					</Sequence.Item>
					<Sequence.Item showFor={Infinity}>
						<div className="too-long-message">
							<span className="message">{t('publishingMessageThree.message')}</span>
							<span className="button" onClick={this.onPublishDismiss}>{t('publishingMessageThree.button')}</span>
						</div>
					</Sequence.Item>
				</Sequence.Timed>
			</div>
		);
	}


	renderSuccess = () => {
		return (
			<div className="success-indicator">
				<Sequence.Timed onFinish={this.onSuccessFinish}>
					<Sequence.Item showFor={5000}>
						<div className="success">
							<i className="icon-check" />
							<span>{t('successMessage')}</span>
						</div>
					</Sequence.Item>
				</Sequence.Timed>
			</div>
		);
	}


	renderFailure = () => {
		return (
			<div className="failure-indicator">
				<Sequence.Timed onFinish={this.onFailureFinish}>
					<Sequence.Item showFor={5000}>
						<div className="failure">
							<span className="icon">!</span>
							<span>{t('failureMessage')}</span>
						</div>
					</Sequence.Item>
				</Sequence.Timed>
			</div>
		);
	}
}
