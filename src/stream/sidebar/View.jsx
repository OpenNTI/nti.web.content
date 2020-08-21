import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Prompt, Flyout } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import FilterSidebar from './FilterSidebar';
const { Dialog } = Prompt;

const t = scoped('nti-web-content.stream.sidebar', {
	filterHeader: 'Filters',
	done: 'Done'
});


class Sidebar extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		params: PropTypes.shape({
			types: PropTypes.object,
			sortOn: PropTypes.string,
			batchAfter: PropTypes.string
		}),
		type: PropTypes.oneOf(['dialog', 'flyout']),
		onDialogVisibilityChange: PropTypes.func
	};

	state = {
		showDialog: false
	};

	attachFilterRef = x => this.filterFlyout = x;

	onDateChange = option => {
		this.props.onChange({ ...this.props.params, batchAfter: option.value });
	};

	onTypeChange = (option, selected) => {
		this.props.onChange({
			...this.props.params,
			types: {
				...this.props.params.types,
				[option.value]: selected
			}
		});
	};

	onSortByChange = ({ target: { value } }) => {
		this.props.onChange({ ...this.props.params, sortOn: value });
	};

	renderFilter = () => {
		const { params } = this.props;

		return (
			<FilterSidebar
				params={params}
				onTypeChange={this.onTypeChange}
				onDateChange={this.onDateChange}
				onSortByChange={this.onSortByChange}
			/>
		);
	};

	toggleFilterMenu = () => {
		this.setState({ showDialog: !this.state.showDialog }, () => {
			const {onDialogVisibilityChange} = this.props;

			if(onDialogVisibilityChange) {
				onDialogVisibilityChange(this.state.showDialog);
			}
		});
	};

	renderDialog () {
		const { showDialog } = this.state;
		return (
			<React.Fragment>
				<div className="stream-dialog-container">
					<div className="filter-trigger" onClick={this.toggleFilterMenu}>
						Filters
					</div>
				</div>

				{showDialog && (
					<Dialog className="stream-dialog">
						<div className="filter-menu-container">
							<div className="controls">
								<div className="header">
									{t('filterHeader')}
								</div>
								<div
									className="confirm"
									onClick={this.toggleFilterMenu}
								>
									{t('done')}
								</div>
							</div>
							{this.renderFilter()}
						</div>
					</Dialog>
				)}
			</React.Fragment>
		);
	}

	renderTrigger () {
		return (
			<div className="stream-filter-trigger-container">
				<div className="stream-filter-trigger">Filters</div>
			</div>
		);
	}

	renderFlyout = () => {
		return (
			<Flyout.Triggered
				className="stream-filter"
				trigger={this.renderTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
				ref={this.attachFilterRef}
				arrow
			>
				<div>
					{this.renderFilter()}
				</div>
			</Flyout.Triggered>
		);
	}

	render () {
		const { type } = this.props;
		return (
			<React.Fragment>
				{type === 'dialog' && this.renderDialog()}
				{type === 'flyout' && this.renderFlyout()}
				{!type && this.renderFilter()}
			</React.Fragment>
		);
	}
}

export default Sidebar;
