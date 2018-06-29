import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';

import { LANGUAGES } from './constants';

const SelectInput = Input.Select;


export default class Controls extends Component {

	static propTypes = {
		language: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		attachLangRef: PropTypes.func.isRequired
	};

	onChange = (value) => {
		const { onChange } = this.props;

		if (onChange) {
			onChange(value);
		}
	}

	render () {
		const { language } = this.props;

		return (
			<div className="code-controls">
				<div className="spacer" />
				<SelectInput
					className="code-language"
					value={language}
					onChange={this.onChange}
					ref={this.props.attachLangRef}
					optionsClassName="code-language-options"
				>
					{Object.entries(LANGUAGES).map(([display, lang]) => {
						return (
							<SelectInput.Option key={display} value={lang}>
								{display}
							</SelectInput.Option>
						);
					})}
				</SelectInput>
				<i className="dropdown icon-chevron-down" />
				<div className="remove rm-editor">
					<i className="icon-bold-x rm-editor" />
				</div>
			</div>
		);
	}
}
