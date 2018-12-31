import React from 'react';
import PropTypes from 'prop-types';

const COLOR_OPTIONS = [
	{name: 'yellow', color: 'EDE619'},
	{name: 'green', color: '4CE67F'},
	{name: 'blue', color: '3FB3F6'}
];

export default class ContextMenuHighlights extends React.Component {
	static propTypes = {
		annotations: PropTypes.bool
	}


	selectOption = (e) => {
		debugger;
	}


	render () {
		const {annotations} = this.props;

		if (!annotations) { return null; }

		return (
			<div className="context-menu-highlights">
				<ul className="options">
					{COLOR_OPTIONS.map((option, key) => {
						const {name, color} = option;

						return (
							<li
								key={key}
								data-option-name={name}
								onClick={this.selectOption}
							>
								<div className="color" style={{backgroundColor: `#${color}`}} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
