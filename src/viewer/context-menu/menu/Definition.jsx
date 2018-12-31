import React from 'react';
import PropTypes from 'prop-types';
import {Layouts} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import {canShowDefinitions, getWordsForDefinition} from '../utils';

const isNarrow = params => params.containerWidth < 100;

const t = scoped('content.viewer.context-menu.menu.Definition', {
	define: 'Define'
});

export default class ContextMenuDefinition extends React.Component {
	static propTypes = {
		userSelection: PropTypes.object,
		pageDescriptor: PropTypes.object
	}

	state = {}

	constructor (props) {
		super(props);

		const {userSelection} = props;

		this.state = {
			words: getWordsForDefinition(userSelection)
		};
	}


	componentDidUpdate (prevProps) {
		const {userSelection} = this.props;
		const {userSelection:oldSelection} = prevProps;

		if (userSelection !== oldSelection) {
			this.setState({
				words: getWordsForDefinition(userSelection)
			});
		}
	}

	render () {
		const {pageDescriptor} = this.props;
		const {words}  = this.state;

		if (!canShowDefinitions(pageDescriptor) || !words) {
			return null;
		}

		return (
			<Layouts.Responsive.Container className="context-menu-definition">
				<Layouts.Responsive.Item
					query={isNarrow}
					render={this.renderNarrow}
				/>
				<Layouts.Responsive.Item
					query={Layouts.Responsive.not(isNarrow)}
					render={this.renderWide}
				/>
			</Layouts.Responsive.Container>
		);
	}


	renderNarrow = () => {
		return (
			<div className="definition-button narrow" onClick={this.showDefinition}>
				<i className="icon-search" />
			</div>
		);
	}


	renderWide = () => {
		return (
			<div className="definition-button wide" onClick={this.showDefinition}>
				<i className="icon-search" />
				<span className="label">{t('define')}</span>
			</div>
		);
	}
}
