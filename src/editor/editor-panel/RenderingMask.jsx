import React from 'react';
import cx from 'classnames';

import {PUBLISHING} from '../Constants';
import Store from '../Store';

export default class ContentEditorRenderingMask extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object
	}

	state = {}

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

		if (publishing !== job.isPending) {
			this.setState({
				publishing: job.isPending
			});
		}
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


	render () {
		const {publishing} = this.state;
		const cls = cx('content-editor-render-mask', {publishing});

		return (
			<div className={cls}>
				{publishing ?
						null :
						(
							<div>
								<span>Rendering Mask</span>
							</div>
						)
				}
			</div>
		);
	}
}
