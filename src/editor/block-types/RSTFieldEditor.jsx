import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Selection} from 'nti-web-commons';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';

import {Parser} from '../../RST';
import {Editor, Plugins, BLOCKS, STYLES} from '../../draft-core';

function rstToDraft (rst) {
	const draftState = rst && Parser.convertRSTToDraftState(rst);
	const {blocks} = draftState || {blocks: []};

	return blocks && blocks.length ?
				EditorState.createWithContent(convertFromRaw(draftState)) :
				EditorState.createEmpty();
}

const plugins = [
	Plugins.LimitBlockTypes.create({allowed: new Set([BLOCKS.UNSTYLED])}),
	Plugins.LimitStyles.create({allowed: new Set([STYLES.BOLD, STYLES.ITALIC, STYLES.UNDERLINE])}),
	Plugins.ExternalLinks.create(),
	Plugins.SingleLine.create()
];

export default class RSTFieldEditor extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,//A RST value
		fieldId: PropTypes.string,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func
	}


	attachEditorRef = x => this.editor = x


	constructor (props) {
		super(props);

		this.state = this.getStateFor(props);
	}


	componentWillReceiveProps (nextProps) {
		const {value:newValue} = nextProps;
		const {value:oldValue} = this.props;


		if (newValue !== oldValue) {
			this.setState(this.setStateFor(nextProps));
		}
	}


	getStateFor (props = this.props) {
		const {value} = props;

		return {
			editorState: rstToDraft(value)
		};
	}


	onEditorFocus = () => {
		const {onFocus} = this.props;

		this.setState({
			selectableValue: this.editor
		});

		if (onFocus) {
			onFocus();
		}
	}


	onEditorBlur = () => {
		const {onBlur} = this.props;

		this.setState({
			selectableValue: null
		});

		if (onBlur) {
			onBlur();
		}
	}


	render () {
		const {className, fieldId, ...otherProps} = this.props;
		const {editorState, selectableValue} = this.state;
		const cls = cx('rst-field-editor', className);

		delete otherProps.value;
		delete otherProps.onChange;

		return (
			<Selection.Component className={cls} value={selectableValue} id={fieldId}>
				<Editor
					editorState={editorState}
					plugins={plugins}
					onFocus={this.onEditorFocus}
					onBlur={this.onEditorBlur}
					{...otherProps}
				/>
			</Selection.Component>
		);
	}
}
