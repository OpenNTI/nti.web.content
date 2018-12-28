import React from 'react';
import PropTypes from 'prop-types';

import Annotations from './annotations';
import Content from './content';
import ContextMenu from './context-menu';
import Store from './Store';

export default
@Store.connect()
class NTIContentViewer extends React.Component {
	static deriveBindingFromProps ({bundle, pageId}) {
		return {
			bundle,
			pageId
		};
	}

	static propTypes = {
		pageId: PropTypes.string.isRequired,
		bundle: PropTypes.object.isRequired,

		contextMenu: PropTypes.bool,
		annotations: PropTypes.bool,
		analytics: PropTypes.bool
	}


	static defaultProps = {
		contextMenu: true,
		annotations: true,
		analytics: true
	}

	render () {
		const {annotations, contextMenu, ...otherProps} = this.props;

		let content = (<Content {...otherProps} />);

		if (contextMenu) {
			content = (
				<ContextMenu {...otherProps} annotations={annotations}>
					{content}
				</ContextMenu>
			);
		}

		if (annotations) {
			content = (
				<Annotations {...otherProps}>
					{content}
				</Annotations>
			);
		}

		//TODO: render an analytics wrapper if analytics are turned on

		return content;
	}
}
