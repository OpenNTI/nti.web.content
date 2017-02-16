import React from 'react';
import {StickyElement, StickyContainer} from 'nti-web-commons';

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
				<span>Editor Panel</span>
			</StickyContainer>
		);
	}
}
