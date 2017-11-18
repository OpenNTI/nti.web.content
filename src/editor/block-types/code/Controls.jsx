import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { NestedEditorWrapper } from '../../../draft-core';

import { LANGUAGES } from './constants';

export default class Controls extends Component {

	static propTypes = {
		language: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
	};

	constructor (props) {
		super(props);
		this.state = { language: props.language };
	}

	render () {
		const { language } = this.state;
		const { onChange } = this.props;

		return (
			<div className="code-controls">
				<NestedEditorWrapper>
					<select name="code-language" value={language} onChange={onChange}>
						{
							LANGUAGES.map(lang => (
								<option key={lang} value={lang}>
									{lang}
								</option>
							))
						}
					</select>
				</NestedEditorWrapper>
			</div>
		);
	}
}
