import React from 'react';
import PropTypes from 'prop-types';
import isTouch from '@nti/util-detection-touch';
import {Connectors} from '@nti/lib-store';

import MouseContext from './mouse';

@Connectors.Any.connect(['userSelection'])
class ContentViewerContextMenu extends React.Component {
	static propTypes = {
		children: PropTypes.node,

		userSelection: PropTypes.shape({
			event: PropTypes.object.isRequired,
			range: PropTypes.object.isRequired,
			selection: PropTypes.object.isRequired
		})
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


	renderSelection (selection) {
		return isTouch ?
			null :
			(<MouseContext userSelection={selection} />);
	}
}

export default ContentViewerContextMenu;
