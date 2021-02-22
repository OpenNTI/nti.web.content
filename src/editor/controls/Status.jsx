import './Status.scss';
import React from 'react';
import { Errors } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { SET_ERROR, SAVING, SAVE_ENDED } from '../Constants';
import Store from '../Store';

const {
	Field: { FlyoutList: ErrorFlyoutList },
} = Errors;

const defaultText = {
	saving: 'Saving...',
	saved: 'All Changes Saved',
};

const t = scoped('web-content.editor.controls.Status', defaultText);

export default class ContentEditorStatus extends React.Component {
	constructor(props) {
		super(props);

		const { errors } = Store;

		this.state = {
			errors,
			saving: false,
			hasUpdated: false,
		};
	}

	componentDidMount() {
		Store.removeChangeListener(this.onStoreChange);
		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.onStoreChange);
	}

	onStoreChange = data => {
		const { type } = data;

		if (type === SAVING || type === SAVE_ENDED) {
			this.onSaveChanged();
		} else if (type === SET_ERROR) {
			this.onErrorsChanged();
		}
	};

	onSaveChanged = () => {
		const { isSaving } = Store;

		this.setState({
			isSaving,
			hasUpdated: true,
		});
	};

	onErrorsChanged = () => {
		const { errors: oldErrors } = this.state;
		const { errors: newErrors } = Store;

		if (oldErrors !== newErrors) {
			this.setState({
				errors: newErrors,
			});
		}
	};

	render() {
		const { isSaving, hasUpdated, errors } = this.state;
		const hasErrors = errors.length > 0;

		return (
			<div className="content-editor-status">
				{hasErrors && !isSaving
					? this.renderErrors(errors)
					: this.renderStatus(isSaving, hasUpdated)}
			</div>
		);
	}

	renderStatus(isSaving, hasUpdated) {
		let text;

		//If we have udpated and we aren't saving show saved text
		if (hasUpdated && !isSaving) {
			text = t('saved');
		} else if (isSaving) {
			text = t('saving');
		}

		return <span className="status">{text}</span>;
	}

	renderErrors(errors) {
		return <ErrorFlyoutList errors={errors} />;
	}
}
