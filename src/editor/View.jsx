import PropTypes from 'prop-types';
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

const stop = e => e.preventDefault();

function getBody () {
	return typeof document === 'undefined' ? null : document.body;
}

export default class ContentEditor extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		onDidChange: PropTypes.func,
		breadcrumb: PropTypes.array,
		gotoResources: PropTypes.func,
		onDelete: PropTypes.func,
		handleNavigation: PropTypes.func
	}

	static childContextTypes = {
		SelectionManager: PropTypes.shape({
			select: PropTypes.func,
			unselect: PropTypes.func
		})
	}


	componentDidMount () {
		const body = getBody();

		Store.addChangeListener(this.onStoreChange);

		//TODO: figure out if this needs to be more generalized to be used elsewhere
		if (body) {
			body.addEventListener('drop', stop);
		}
	}


	componentWillUnmount () {
		const {onDidChange} = this.props;
		const body = getBody();

		resetStore();
		Store.removeChangeListener(this.onStoreChange);

		if (body) {
			body.removeEventListener('drop', stop);
		}

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
		const {contentPackage, course, gotoResources, breadcrumb, handleNavigation} = this.props;
		const sidebar = (<Sidebar contentPackage={contentPackage} course={course} selectionManager={selectionManager} />);

		return (
			<div className="content-editor">
				<PanelSidebar className="content-editor-panel-sidebar" sidebar={sidebar}>
					<EditorPanel contentPackage={contentPackage} course={course} gotoResources={gotoResources} breadcrumb={breadcrumb} />
				</PanelSidebar>
				<ControlBar visible>
					<Controls selectionManager={selectionManager} contentPackage={contentPackage} course={course} handleNavigation={handleNavigation}/>
				</ControlBar>
			</div>
		);
	}
}
