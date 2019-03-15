import React from 'react';
import PropTypes from 'prop-types';

export default class MediaChooser extends React.Component {

	static propTypes = {
		course: PropTypes.object,
		onChange: PropTypes.func
	}

	state = {}

	componentDidMount () {
		this.load();
	}

	componentDidUpdate ({course: prevCourse}) {
		if (prevCourse !== this.props.course) {
			this.load();
		}
	}

	load = async () => {
		const {course, onChange} = this.props;

		if (!course) {
			return;
		}

		const storedId = localStorage.getItem('transcript-test-video-ntiid');
		const videoIndex = await course.getVideoIndex();
		if (videoIndex && storedId && onChange) {
			const video = videoIndex.get(storedId);
			if (video) {
				onChange(video);
			}
		}
		this.setState({videoIndex});
	}
	
	onClick = item => {
		localStorage.setItem('transcript-test-video-ntiid', item.getID());
		const {onChange} = this.props;
		onChange(item);
	}

	render () {
		const {videoIndex} = this.state;

		return !videoIndex ? null : (
			<ul>
				{videoIndex.map(item => <Item key={item.getID()} item={item} onClick={this.onClick} />)}
			</ul>
		);
	}
}

class Item extends React.PureComponent {

	static propTypes = {
		item: PropTypes.object,
		onClick: PropTypes.func
	}

	onClick = () => this.props.onClick(this.props.item)

	render () {
		const {item} = this.props;

		return (
			<li onClick={this.onClick}>{item.title}</li>
		);
		
	}
}