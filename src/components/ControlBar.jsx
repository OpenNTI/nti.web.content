import './ControlBar.scss';
import PropTypes from 'prop-types';
import React from 'react';
import {ControlBar, Button} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const DEFAULT_TEXT = {
	preview: {
		reading: 'You\'re currently previewing reading.',
		survey: 'You\'re currently previewing this survey'
	},
	button: 'Start Editing'
};

const t = scoped('web-content.AssignmentControlBar', DEFAULT_TEXT);


export default class AssignmentControlBar extends React.Component {
	static propTypes = {
		doEdit: PropTypes.func,
		type: PropTypes.string
	}


	onClick = (e) => {
		const {doEdit} = this.props;

		e.preventDefault();
		e.stopPropagation();

		if (doEdit) {
			doEdit();
		}
	}


	render () {
		const {type = 'reading'} = this.props;

		const messageKey = `preview.${type}`;
		const message = t.isMissing(messageKey) ? '' : t(messageKey);

		return (
			<ControlBar visible className="content-control-bar-container">
				<div className="content-control-bar">
					<div className="message">
						<i className="icon-view" />
						<span>{message}</span>
					</div>
					<Button rounded onClick={this.onClick} href="./edit">{t('button')}</Button>
				</div>
			</ControlBar>
		);
	}
}
