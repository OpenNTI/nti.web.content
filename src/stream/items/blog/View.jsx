import React from 'react';
import PropTypes from 'prop-types';

import Registry from '../Registry';

export default
@Registry.register('application/vnd.nextthought.forums.personalblogentry')
class BlogItem extends React.Component {

	static propTypes = {
		item: PropTypes.object
	}

	render () {
		return (
			<div className="nti-content-stream-blog-item">
				(Blog item)
			</div>
		);
	}
}
