import React from 'react';
import {ControlBar} from '@nti/web-commons';

import Menu from '../menu';

export default class TouchContextMenu extends React.Component {
	render () {
		return (
			<ControlBar visible>
				<Menu {...this.props} touch />
			</ControlBar>
		);
	}
}
