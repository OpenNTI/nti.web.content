import React from 'react';
import PropTypes from 'prop-types';

import Annotations from './annotations';
import Content from './content';
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
		annotations: PropTypes.bool,
		analytics: PropTypes.bool
	}


	static defaultProps = {
		annotations: true,
		analytics: true
	}

	render () {
		const {annotations, ...otherProps} = this.props;

		let content = (<Content {...otherProps} />);

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
