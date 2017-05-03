import React from 'react';
import PropTypes from 'prop-types';

export default class CaptionEditor extends React.Component {
	static propTypes = {
		body: PropTypes.array,
		onChange: PropTypes.func
	}


	onChange = () => {
		//TODO: fill this out
	}


	render () {
		const {body} = this.props;

		return (
			<div className="caption-editor">
				<div className="title">{body[0] || ''}</div>
				<div className="description">{body[1] || ''}</div>
			</div>
		);
	}
}
