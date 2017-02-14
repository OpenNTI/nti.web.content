/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {DraftCore} from '../../src';
// import RSTTest from '../../src/RST/test';

import 'normalize.css';
import 'nti-style-common/fonts.scss';
import 'nti-web-commons/lib/index.css';


//Test: Content package: tag:nextthought.com,2011-10:NTI-HTML-system_4744023779772891797_C92F81A2

class Test extends React.Component {

	state = {}

	attachEditor1Ref = e => this.editor1 = e;
	attachEditor2Ref = e => this.editor2 = e;
	logValue = ()=> console.debug(this.focused.getValue())
	logState = ()=> this.focused.logState()
	// focusError = () => error.focus()
	focusToEnd = () => this.editor1.focusToEnd()

	onFocus = (editor) => {
		this.setState({editor});
		this.focused = editor;
	}

	render () {
		return (
			<div>
				<DraftCore.Editor onFocus={this.onFocus} />
				<DraftCore.ContextProvider editor={this.state.editor}>
					<div>
						<DraftCore.BoldButton />
						<DraftCore.ItalicButton />
						<DraftCore.UnderlineButton />
					</div>
				</DraftCore.ContextProvider>
			</div>
		);
		// return (<RSTTest />);
		// return (
		// 	<div>
		// 		<div>
		// 			<div className="text-editor">
		// 			<Editor plugins={[counter]}
		// 				onFocus={this.onFocus}
		// 				ref={this.attachEditor1Ref}
		// 				allowInsertVideo
		// 				allowInsertImage
		// 				/>
		// 			<CharCount/>
		// 			</div>

		// 			<TextEditor charLimit={150}
		// 				countDown
		// 				onFocus={this.onFocus}
		// 				onBlur={this.onBlur}
		// 				ref={this.attachEditor2Ref}
		// 				error={error}
		// 				singleLine
		// 				/>
		// 		</div>

		// 		<EditorContextProvider editor={this.state.editor}>
		// 			<div>
		// 				<FormatButton format={FormatButton.Formats.BOLD}/>
		// 				<FormatButton format={FormatButton.Formats.ITALIC}/>
		// 				<FormatButton format={FormatButton.Formats.UNDERLINE}/>
		// 			</div>
		// 		</EditorContextProvider>

		// 		<div>
		// 			<button style={{marginTop: 10, textAlign: 'center'}} onClick={this.logState}>
		// 				Log State
		// 			</button>

		// 			&nbsp;

		// 			<button style={{marginTop: 10, textAlign: 'center'}} onClick={this.logValue}>
		// 				Log Value
		// 			</button>

		// 			<button style={{marginTop: 10, textAlign: 'center'}} onClick={this.focusError}>
		// 				Focus Error
		// 			</button>

		// 			<button style={{marginTop: 10, textAlign: 'center'}} onClick={this.focusToEnd}>
		// 				Focus To End
		// 			</button>
		// 		</div>
		// 	</div>
		// );
	}
}


ReactDOM.render(
	<Test/>,
	document.getElementById('content')
);
