import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumb from '../../breadcrumb';
import Registry from '../Registry';

import Detail from './Detail';

@Registry.register('application/vnd.nextthought.note')
class Note extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		context: PropTypes.object
	}

	render () {
		const { item, context } = this.props;

		return (
			<div className="nti-content-stream-note">
				<Breadcrumb className="note-breadcrumb" item={item} context={context} />
				<Detail item={item} />
			</div>
		);
	}
}

export default Note;
