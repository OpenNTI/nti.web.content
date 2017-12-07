import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { LANGUAGES } from './constants';

const LANG_MAP = {
	'Common Lisp': 'lisp',
	'Ezhil Ezhil': 'ezhil',
	'Visual Basic.NET': 'vbnet',
	'Visual FoxPro': 'foxpro'
};

export default class Controls extends Component {

	static propTypes = {
		language: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		onRemove: PropTypes.func.isRequired
	};


	onChange = ({ target: { value }}) => {
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
				<select className="code-language" name="code-language" value={language} onChange={this.onChange}>
					{
						LANGUAGES.map(lang => (
							<option key={lang} value={LANG_MAP[lang] || lang}>
								{lang}
							</option>
						))
					}
				</select>
				<i className="dropdown icon-chevron-down" />
				<div className="remove rm-editor">
					<i className="icon-bold-x rm-editor" />
				</div>
			</div>
		);
	}
}
