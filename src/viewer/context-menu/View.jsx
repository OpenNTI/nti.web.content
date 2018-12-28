import React from 'react';
import PropTypes from 'prop-types';
import isTouch from '@nti/util-detection-touch';

import Store from '../Store';

import {hasContextToShow} from './utils';
import MouseContext from './mouse';
import TouchContext from './touch';

@Store.monitor(['userSelection', 'pageDescriptor'])
class ContentViewerContextMenu extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		annotations: PropTypes.bool,

		pageDescriptor: PropTypes.object,
		userSelection: PropTypes.shape({
			event: PropTypes.object.isRequired,
			range: PropTypes.object.isRequired,
			selection: PropTypes.object.isRequired
		})
	}


	render () {
		const {children, pageDescriptor, userSelection, annotations} = this.props;
		const shouldShow = userSelection && pageDescriptor && hasContextToShow(userSelection, pageDescriptor, annotations);

		return (
			<>
				{children}
				{shouldShow && this.renderSelection(userSelection)}
			</>
		);
	}


	renderSelection (selection) {
		const otherProps = {...this.props};

		delete otherProps.children;

		return isTouch ?
			(<TouchContext userSelection={selection} {...otherProps} />) :
			(<MouseContext userSelection={selection} {...otherProps} />);
	}
}

export default ContentViewerContextMenu;
