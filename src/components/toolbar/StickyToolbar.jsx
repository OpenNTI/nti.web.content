import React from 'react';
import PropTypes from 'prop-types';
import { StickyElement, StickyContainer } from 'nti-web-commons';

import Toolbar from './Toolbar';

export default class StickyToolbar extends React.Component {
	static propTypes = {
		path: PropTypes.any,
		pageSource: PropTypes.any,
		toc: PropTypes.object,
		hideControls: PropTypes.bool,
		hideHeader: PropTypes.bool,
		doNavigation: PropTypes.func
	}

	constructor (props) {
		super(props);
	}

	renderToolbar () {
		return (<Toolbar path={this.props.path} pageSource={this.props.pageSource} doNavigation={this.props.doNavigation}
			hideControls={this.props.hideControls} hideHeader={this.props.hideHeader} toc={this.props.toc}/>);
	}

	render () {
		return (<StickyContainer><StickyElement>{this.renderToolbar()}</StickyElement></StickyContainer>);
	}
}
