import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Selection } from '@nti/web-commons';
import {
	Editor,
	Plugins,
	BLOCKS,
	NestedEditorWrapper,
	STYLE_SET,
} from '@nti/web-editor';

import { rstToDraft, draftToRST, stopInsertDrop } from './utils';

const plugins = [
	Plugins.LimitBlockTypes.create({ allow: new Set([BLOCKS.UNSTYLED]) }),
	Plugins.LimitStyles.create({ allow: STYLE_SET }),
	Plugins.LimitLinks.create(),
	Plugins.SingleLine.create(),
	{ handleDrop: stopInsertDrop },
];

export default class RSTFieldEditor extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string, //A RST value
		fieldId: PropTypes.string,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		setReadOnly: PropTypes.func,
		contentChangeBuffer: PropTypes.number,
	};

	static defaultProps = {
		contentChangeBuffer: 0,
	};

	attachEditorRef = x => (this.editor = x);

	constructor(props) {
		super(props);

		this.pendingSaves = [];

		this.state = this.computeState(props);
	}

	focus() {
		if (this.editor) {
			this.editor.focus();
		}
	}

	isPendingSave(value) {
		for (let save of this.pendingSaves) {
			if (save === value) {
				return true;
			}
		}

		return false;
	}

	cleanUpPending(value) {
		this.pendingSaves = this.pendingSaves.filter(save => save !== value);
	}

	componentDidUpdate(prevProps) {
		const { value: newValue } = this.props;
		const { value: oldValue } = prevProps;

		if (newValue !== oldValue && !this.isPendingSave(newValue)) {
			this.setState(this.computeState());
		}
	}

	computeState(props = this.props) {
		const { value } = props;

		return {
			editorState: rstToDraft(value),
		};
	}

	onEditorFocus = () => {
		const { onFocus } = this.props;

		this.setState({
			selectableValue: this.editor,
		});

		if (onFocus) {
			onFocus();
		}
	};

	onEditorBlur = () => {
		const { onBlur } = this.props;

		this.setState({
			selectableValue: null,
		});

		if (onBlur) {
			onBlur();
		}
	};

	onStartEditing = () => {
		const { setReadOnly } = this.props;

		if (setReadOnly) {
			setReadOnly(true);
		}
	};

	onStopEditing = () => {
		const { setReadOnly } = this.props;

		if (setReadOnly) {
			setReadOnly(false);
		}
	};

	onContentChange = editorState => {
		const { onChange, value: oldValue } = this.props;
		const newValue = draftToRST(editorState);

		if (onChange && newValue.trim() !== oldValue.trim()) {
			this.pendingSaves.push(newValue);
			onChange(newValue);
		}
	};

	render() {
		const {
			className,
			fieldId,
			contentChangeBuffer,
			...otherProps
		} = this.props;
		const { editorState, selectableValue } = this.state;
		const cls = cx('rst-field-editor', className);

		delete otherProps.value;
		delete otherProps.onChange;

		return (
			<Selection.Component
				className={cls}
				value={selectableValue}
				id={fieldId}
			>
				<NestedEditorWrapper
					className="rst-field-nested-wrapper"
					onFocus={this.onStartEditing}
					onBlur={this.onStopEditing}
				>
					<Editor
						ref={this.attachEditorRef}
						editorState={editorState}
						plugins={plugins}
						onFocus={this.onEditorFocus}
						onBlur={this.onEditorBlur}
						onContentChange={this.onContentChange}
						contentChangeBuffer={contentChangeBuffer}
						{...otherProps}
					/>
				</NestedEditorWrapper>
			</Selection.Component>
		);
	}
}
