import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Selection, Layouts, Prompt } from '@nti/web-commons';

import Store from './Store';
import { DELETED } from './Constants';
import { resetStore } from './Actions';
import Sidebar from './sidebar';
import EditorPanel from './editor-panel';
import Controls from './controls';

const t = scoped('web-content.editor.Modal', {
	wasDeleted: {
		title: 'Reading Deleted',
		message: 'This reading has been deleted.',
	},
});

const selectionManager = new Selection.Manager();
const stop = e => e.preventDefault();
const getBody = () => (typeof document === 'undefined' ? null : document.body);

export default class ContentEditorModal extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		onDidChange: PropTypes.func,
		onDelete: PropTypes.func,
		navigateToPublished: PropTypes.func,
	};

	static childContextTypes = {
		SelectionManager: PropTypes.shape({
			select: PropTypes.func,
			unselect: PropTypes.func,
		}),
	};

	componentDidMount() {
		const body = getBody();

		Store.addChangeListener(this.onStoreChange);

		if (body) {
			body.addEventListener('drop', stop);
		}
	}

	componentWillUnmount() {
		const { onDidChange } = this.props;
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

	onStoreChange = data => {
		const { type } = data;

		if (type === DELETED) {
			this.onDelete();
		}
	};

	onDelete() {
		const { onDelete } = this.props;

		if (Store.hasDeleted) {
			onDelete();
		} else {
			Prompt.alert(t('wasDeleted.message'), t('wasDeleted.title')).then(
				() => {
					onDelete();
				}
			);
		}
	}

	getChildContext() {
		return {
			SelectionManager: selectionManager,
		};
	}

	render() {
		const { contentPackage, course, navigateToPublished } = this.props;
		const readOnly = !contentPackage || !contentPackage.isModifiable;

		return (
			<div className="content-editor-modal">
				<Layouts.Aside
					component={Sidebar}
					contentPackage={contentPackage}
					course={course}
					selectionManager={selectionManager}
				/>
				<EditorPanel
					contentPackage={contentPackage}
					course={course}
					readOnly={readOnly}
				/>
				<div className="controls">
					<Controls
						selectionManager={selectionManager}
						contentPackage={contentPackage}
						course={course}
						navigateToPublished={navigateToPublished}
						readOnly={readOnly}
					/>
				</div>
			</div>
		);
	}
}
