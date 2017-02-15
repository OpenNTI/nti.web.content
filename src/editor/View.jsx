import React from 'react';
import {Selection, ControlBar} from 'nti-web-commons';

import {PanelSidebar} from '../common';

import Sidebar from './sidebar';
import RSTEditor from './rst-editor';
import Controls from './controls';

const selectionManager = new Selection.Manager();

export default class ContentEditor extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object
	}

	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.func,
			unselect: React.PropTypes.func
		})
	}


	getChildContext () {
		return {
			SelectionManager: selectionManager
		};
	}

	render () {
		const sidebar = (<Sidebar />);

		return (
			<div className="content-editor">
				<PanelSidebar className="content-editor-panel-sidebar" sidebar={sidebar}>
					<RSTEditor />
				</PanelSidebar>
				<ControlBar visible>
					<Controls />
				</ControlBar>
			</div>
		);
	}
}
