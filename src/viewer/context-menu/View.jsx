import React from 'react';
import PropTypes from 'prop-types';
import {Connectors} from '@nti/lib-store';

@Connectors.Any.connect(['userSelection'])
class ContentViewerContextMenu extends React.Component {
	static propTypes = {
		children: PropTypes.node,

		userSelection: PropTypes.object
	}


	render () {
		const {children, userSelection} = this.props;

		return (
			<>
				{children}
				{userSelection && this.renderSelection(userSelection)}
			</>
		);
	}


	renderSelection ({range}) {
		console.log('Selection Change: ', range.toString());//eslint-disable-line
	}
}

export default ContentViewerContextMenu;
