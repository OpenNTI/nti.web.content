import PropTypes from 'prop-types';
import React from 'react';
import {ControlBar, Button} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	preview: 'You\'re currently previewing reading.',
	button: 'Start Editing'
};

const t = scoped('ASSIGNMENT_CONTROL_BAR', DEFAULT_TEXT);


export default class AssignmentControlBar extends React.Component {
	static propTypes = {
		doEdit: PropTypes.func
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
		return (
			<ControlBar visible>
				<div className="content-control-bar">
					<div className="message">
						<i className="icon-view" />
						<span>{t('preview')}</span>
					</div>
					<Button rounded onClick={this.onClick} href="./edit">{t('button')}</Button>
				</div>
			</ControlBar>
		);
	}
}
