import React from 'react';

export default class FigureEditor extends React.Component {
	static propTypes = {
		url: React.PropTypes.string
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
