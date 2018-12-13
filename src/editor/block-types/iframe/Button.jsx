import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {BLOCKS} from '@nti/web-editor';

import Button from '../common/Button';

import IframePicker from './Picker';
import {isIframeRefBlock} from './util';

const DEFAULT_TEXT = {
	label: 'Iframe'
};

const t = scoped('web-content.editor.block-types.iframe.button', DEFAULT_TEXT);


export default class IframeButton extends React.Component {
	static propTypes = {
		course: PropTypes.object
	};

	constructor () {
		super();

		this.state = this.getStateFor(this.props);
	}

	getStateFor = () => ({});

	attachButtonRef = x => this.buttonRef = x;

	createBlock = insertBlock => {
		IframePicker.show()
			.then(iframeObj => {
				insertBlock({
					type: BLOCKS.ATOMIC,
					text: '',
					data: {
						name: 'nti:embedwidget',
						body: [],
						arguments: iframeObj.src,
						options: iframeObj.attributes
					}
				}, false, true);
			})
			.catch(e => {});
	};

	render = () => {
		const {course} = this.props;

		return (
			<Button
				attachPluginRef={this.attachButtonRef}
				className="iframe-button"
				iconClass="content-editor-block-types-iframe-icon"
				label={t('label')}
				createBlock={this.createBlock}
				createBlockProps={{course}}
				isBlockPredicate={isIframeRefBlock}
			/>
		);
	};

}
