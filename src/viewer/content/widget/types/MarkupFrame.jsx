import React from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';

import Registry from './Registry';

@Registry.register(Registry.buildHandler(/nti-data-markup(dis|en)abled/i))
class MarkupFrameWidget extends React.Component {
	propTypes = {
		item: PropTypes.object
	}

	render () {
		return (
			<div>
				Markup Frame
			</div>
		);
	}
}

export {MarkupFrameWidget as default};
