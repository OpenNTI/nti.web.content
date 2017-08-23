import React from 'react';
import { StickyElement, StickyContainer } from 'nti-web-commons';

import Toolbar from './Toolbar';

export default class StickyToolbar extends React.Component {
	constructor (props) {
		super(props);
	}

	renderToolbar () {
		const {...otherProps} = this.props;

		return (<Toolbar {...otherProps}/>);
	}

	render () {
		return (<StickyContainer><StickyElement>{this.renderToolbar()}</StickyElement></StickyContainer>);
	}
}
