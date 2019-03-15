import React from 'react';
import PropTypes from 'prop-types';

export default class OutlineNodeChooser extends React.Component {

	static propTypes = {
		onChange: PropTypes.func,
		course: PropTypes.object
	}

	state = {}

	componentDidMount () {
		this.load();
	}

	componentDidUpdate ({course: prevCourse}) {
		const {course} = this.props;

		if (course !== prevCourse) {
			this.load();
		}
	}

	onNodeClick = node => {
		const {onChange = () => void 0} = this.props;
		onChange(node);
	}

	load = async () => {
		const {course} = this.props;

		if (!course || !course.isCourse || !course.hasOutline()) {
			return;
		}

		const {Outline: outline} = course;

		await outline.getContent();
		const {contents} = outline;

		this.setState({contents});
	}

	render () {
		const {contents} = this.state;

		return (
			<div>
				{contents && (
					<ul>
						{contents.map(item => (
							<Node key={item.title} node={item} onClick={this.onNodeClick}>{item.title}</Node>
						))}
					</ul>
				)}
			</div>
		);
	}
}

class Node extends React.PureComponent {
	static propTypes = {
		node: PropTypes.object,
		onClick: PropTypes.func
	}

	onClick = () => {
		const {node, onClick} = this.props;
		onClick(node);
	}

	render () {
		const {node: {title}} = this.props;

		return (
			<li onClick={this.onClick}>{title}</li>
		);
	}
}