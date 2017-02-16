import React from 'react';
import {StickyElement, StickyContainer} from 'nti-web-commons';

import {ContentOptionSwitcher} from '../../common';

import NavBar from '../nav-bar';

export default class EditorPanel extends React.Component {
	static propTypes = {
		content: React.PropTypes.object,
		course: React.PropTypes.object,
		pageSource: React.PropTypes.object
	}


	render () {
		const {pageSource} = this.props;

		return (
			<StickyContainer className="content-editor-panel">
				<StickyElement>
					<NavBar pageSource={pageSource} />
				</StickyElement>
				<ContentOptionSwitcher options={this.renderOptions()} content={this.renderContent()} />
			</StickyContainer>
		);
	}


	renderOptions = () => {
		return (
			<div>
				<span>Options</span>
			</div>
		);
	}


	renderContent = () => {
		return (
			<div>
				<span>Content</span>
			</div>
		);
	}
}
