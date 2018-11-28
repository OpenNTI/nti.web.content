import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, ZoomableContent} from '@nti/web-commons';

import Bar from './Bar';

export default class ZoomedMarkupFrame extends React.Component {
	static propTypes = {
		part: PropTypes.object,
		onClose: PropTypes.func
	}


	onBeforeDismiss = () => {
		const {onClose} = this.props;

		if (onClose) {
			onClose();
		}
	}


	render () {
		const {part: {item}} = this.props;

		return (
			<Prompt.Dialog
				closeOnMaskClick
				closeOnEscape
				restoreScroll
				onBeforeDismiss={this.onBeforeDismiss}
			>
				<div className="zoomed-markupframe">
					<i className="icon-light-x" onClick={this.onBeforeDismiss} />
					<ZoomableContent className="image-wrapper">
						<img src={item.src} crossOrigin={item.crossOrigin} />
					</ZoomableContent>
					<Bar {...this.props} />
				</div>
			</Prompt.Dialog>
		);
	}
}
