import React from 'react';
import PropTypes from 'prop-types';

export default class FigureEditor extends React.Component {
	static propTypes = {
		url: PropTypes.string
	}

	onClick = () => {
		//TODO: figure out how to edit the image
	}


	render () {
		const {url} = this.props;

		return (
			<div className="figure-editor" style={{backgroundImage: `url(${url})`}} />
		);
	}
}
