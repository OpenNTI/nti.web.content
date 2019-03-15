import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';

export default class CourseChooser extends React.Component {

	static propTypes = {
		onChange: PropTypes.func,
		onError: PropTypes.func,
		course: PropTypes.object
	}

	componentDidMount () {
		let courseId = localStorage.getItem('course-ntiid');

		this.setCourse(courseId);
	}

	onClick = () => this.setCourse()

	setCourse = async (id) => {
		const {onChange, onError} = this.props;
		const courseId = id || window.prompt('Enter Course NTIID');
		localStorage.setItem('course-ntiid', courseId);

		try {
			const service = await getService();
			const course = await service.getObject(courseId);

			this.setState({course});

			if (onChange) {
				onChange(course);
			}
		}
		catch (e) {
			if (onError) {
				onError(e);
			}
		}
	}

	render () {
		const {course} = this.props;
		const courseTitle = course && course.title;

		return (
			<div>
				<button onClick={this.onClick}>Set Course</button>
				<div>{courseTitle}</div>
			</div>
		);
	}
}
