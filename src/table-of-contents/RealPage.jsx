import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	label: 'Page %(number)s'
};

const t = scoped('nti-content.table-of-contents.real-page', DEFAULT_TEXT);

export default class TableOfContentsRealPage extends React.Component {
	static propTypes = {
		page: PropTypes.object,
		doNavigation: PropTypes.func
	}


	onClick () {

	}


	render () {
		const {page} = this.props;
		const {page: number} = page;

		return (
			<div className="table-of-contents-real-page">
				<span className="label">{t('label', {number})}</span>
			</div>
		);
	}
}
