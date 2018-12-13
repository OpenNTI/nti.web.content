import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

const sandboxValues = 'allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups allow-top-navigation';

export default class IframeEditor extends React.Component {
	static propTypes = {
		iframeObj: PropTypes.object
	}

	blankComponent = () => {
		return (
			<div className="iframe-editor-blank">No IFrame found. Try again.</div>
		);
	};

	innerComponent = () => {
		const {iframeObj} = this.props;
		let iframe, hasData;
		if(iframeObj) {
			iframe = document.createElement('iframe');
			iframe['src'] = iframeObj.src;
			iframe['frameBorder'] = '0';

			for(let key in iframeObj.attributes) {
				if(!iframe[key]) {
					iframe[key] = iframeObj.attributes[key];
				}
			}

			iframe['allow'] = iframe['allowfullscreen'] === 'true' ? 'fullscreen' : '';
			iframe['sandbox'] = iframe['no-sandboxing'] === 'true' ? 'allow-same-origin allow-scripts' : sandboxValues;
		}

		hasData = iframe['src'] && iframe['height'] && iframe['width'];

		return hasData
			? (
				<div className="editor-iframe-embed" {...rawContent(iframe.outerHTML)}/>
			)
			: this.blankComponent();
	};

	render () {
		return (
			<div className="iframe-editor">
				{this.innerComponent()}
			</div>
		);
	}
}
