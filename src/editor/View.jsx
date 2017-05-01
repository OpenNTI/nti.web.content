import React from 'react';
import {scoped} from 'nti-lib-locale';
import {Selection, ControlBar, Prompt} from 'nti-web-commons';

import {PanelSidebar} from '../common';

import Store from './Store';
import {DELETED} from './Constants';
import {resetStore} from './Actions';
import Sidebar from './sidebar';
import EditorPanel from './editor-panel';
import Controls from './controls';

const DEFAULT_TEXT = {
	wasDeleted: {
		title: 'Reading Deleted',
		message: 'This reading has been deleted.'
	}
};

const t = scoped('NTI_CONTENT_EDITOR', DEFAULT_TEXT);

const selectionManager = new Selection.Manager();

export default class ContentEditor extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object,
		onDidChange: React.PropTypes.func,
		breadcrumb: React.PropTypes.array,
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
		const {type} = data;

		if (type === DELETED) {
			this.onDelete();
		}
	}


	onDelete () {
		const {onDelete} = this.props;

		if (Store.hasDeleted) {
			onDelete();
		} else {
			Prompt.alert(t('wasDeleted.message'), t('wasDeleted.title'))
				.then(() => {
					onDelete();
				});
		}
	}


	getChildContext () {
		return {
			SelectionManager: selectionManager
		};
	}

	render () {
		const {contentPackage, course, gotoResources, breadcrumb} = this.props;
		const sidebar = (<Sidebar contentPackage={contentPackage} course={course} />);

		return (
			<div className="content-editor">
				<PanelSidebar className="content-editor-panel-sidebar" sidebar={sidebar}>
					<EditorPanel contentPackage={contentPackage} course={course} gotoResources={gotoResources} breadcrumb={breadcrumb} />
				</PanelSidebar>
				<ControlBar visible>
					<Controls selectionManager={selectionManager} contentPackage={contentPackage} course={course} />
				</ControlBar>
			</div>
		);
	}
}
