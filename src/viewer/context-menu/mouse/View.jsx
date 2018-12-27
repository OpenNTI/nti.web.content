import React from 'react';
import PropTypes from 'prop-types';
import {Flyout} from '@nti/web-commons';

import {getAlignment} from './utils';

export default class MouseContextMenu extends React.Component {
	static propTypes = {
		userSelection: PropTypes.object.isRequired
	}


	render () {
		const {userSelection} = this.props;
		const alignment = getAlignment(userSelection);

		if (!alignment) { return null; }

		return (
			<Flyout.Aligned {...alignment} className="nti-content-mouse-context-menu" visible arrow dark>
				<div>Mouse Context Menu</div>
			</Flyout.Aligned>
		);
	}
}
