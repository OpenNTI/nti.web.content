import React from 'react';
import {Selection, ControlBar} from 'nti-web-commons';

import {PanelSidebar} from '../common';

import Store from './Store';
import {DELETED} from './Constants';
import {resetStore} from './Actions';
import Sidebar from './sidebar';
import EditorPanel from './editor-panel';
import Controls from './controls';

const selectionManager = new Selection.Manager();

export default class ContentEditor extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object,
		onDidChange: React.PropTypes.func,
		gotoResources: React.PropTypes.func,
		onDelete: React.PropTypes.func
	}

	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.func,
			unselect: React.PropTypes.func
		})
	}


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		const {onDidChange} = this.props;

		resetStore();
		Store.removeChangeListener(this.onStoreChange);

		if (onDidChange) {
			onDidChange();
		}
	}


	onStoreChange = (data) => {
		const {onDelete} = this.props;
		const {type} = data;

		if (type === DELETED && onDelete) {
			onDelete();
		}
	}


	getChildContext () {
		return {
			SelectionManager: selectionManager
		};
	}

	render () {
		const {contentPackage, course, gotoResources} = this.props;
		const sidebar = (<Sidebar />);

		return (
			<div className="content-editor">
				<PanelSidebar className="content-editor-panel-sidebar" sidebar={sidebar}>
					<EditorPanel contentPackage={contentPackage} course={course} gotoResources={gotoResources} />
				</PanelSidebar>
				<ControlBar visible>
					<Controls selectionManager={selectionManager} contentPackage={contentPackage} course={course} />
				</ControlBar>
			</div>
		);
	}
}
