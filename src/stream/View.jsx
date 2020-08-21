import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Layouts, Stream, StickyContainer, StickyElement } from '@nti/web-commons';

import Store from './Store';
import Sidebar from './sidebar';
import Page from './Page';

const { InfiniteLoad, Responsive } = Layouts;
const PAGE_HEIGHT = 400;
const { DATE_FILTER_VALUES } = Stream;
const SORT = {
	CREATED_TIME: 'CreatedTime',
	RECENT_ACTIVITY: 'LastModified',
	MOST_COMMENTED: 'ReferencedByCount',
	MOST_LIKED: 'RecursiveLikeCount'
};
const SORT_ORDER = {
	ASCENDING: 'ascending',
	DESCENDING: 'descending'
};

const isLargeView = ({ containerWidth }) => {
	return containerWidth >= 1024;
};

const isMediumView = ({ containerWidth }) => {
	return containerWidth < 1024 && containerWidth >= 400;
};

const isSmallView = ({ containerWidth }) => {
	return containerWidth < 400;
};

class View extends React.Component {
	static propTypes = {
		context: PropTypes.shape({
			getStreamDataSource: PropTypes.func.isRequired
		}).isRequired,
	};

	state = {
		openSearch: true,
		params: {
			types: {
				NOTES: true,
				BOOKMARKS: true,
				HIGHLIGHTS: true,
				THOUGHTS: true,
				LIKES: true,
			},
			batchAfter: DATE_FILTER_VALUES.ANYTIME,
			sortOn: SORT.CREATED_TIME,
			sortOrder: SORT_ORDER.DESCENDING
		}
	};

	componentDidMount () {
		const { context} = this.props;

		if (context) {
			this.setState({
				store: new Store(context, this.state.params)
			});
		}
	}

	componentDidUpdate (prevProps) {
		const { context: newContext } = this.props;
		const { context: oldContext } = prevProps;

		if (oldContext !== newContext) {
			this.setState({
				store: null
			}, () => {
				this.setState({
					store: new Store(newContext, this.state.params)
				});
			});
		}
	}

	onChange = (params) => {
		this.setState({
			params,
			store: null
		}, () => {
			this.setState({ store: new Store(this.props.context, this.state.params)});
		});
	}

	renderPage = (props) => {
		const { context } = this.props;

		return (
			<Page {...props} context={context} />
		);
	}

	renderEmpty = () => {
		const { openSearch } = this.state;
		return (
			<div className="stream-content-empty">
				<div className="stream-empty-container">
					<div className="stream-empty-header">{openSearch ? 'Your notebook is empty.' : 'No Results'}</div>
					<div className="stream-empty-text">{openSearch ? 'Your notes, bookmarks, and other \n actvity will be collected here.' : 'Try expanding your filters to view more items.'}</div>
				</div>
			</div>
		);
	}

	renderLoading () {
		return (
			<div className="loading-container">
				<Loading.Mask />
			</div>
		);
	}

	renderStream = () => {
		const { store } = this.state;
		return (
			<div className="stream-infinite-scroll">
				{!store && this.renderLoading()}
				{store && (
					<InfiniteLoad.Store
						store={store}
						defaultPageHeight={PAGE_HEIGHT}
						renderPage={this.renderPage}
						renderLoading={this.renderLoading}
						renderEmpty={this.renderEmpty}
					/>
				)}
			</div>
		);
	}

	renderCompact = ({ type }) => {
		const { params, showDialog } = this.state;
		return (
			<div className="compact">
				<Sidebar type={type} onChange={this.onChange} params={params} onDialogVisibilityChange={newVisibility => this.setState({showDialog: newVisibility})} />
				{!showDialog && this.renderStream()}
			</div>
		);
	}

	renderFull = () => {
		const { params } = this.state;

		return (
			<StickyContainer>
				<Layouts.NavContent.Container className="stream-view">
					<Layouts.NavContent.Content className="content">
						{this.renderStream()}
					</Layouts.NavContent.Content>
					<Layouts.NavContent.Nav className="nav-bar">
						<StickyElement>
							<Sidebar onChange={this.onChange} params={params} />
						</StickyElement>
					</Layouts.NavContent.Nav>
				</Layouts.NavContent.Container>
			</StickyContainer>
		);
	}

	render () {
		return (
			<Responsive.Container>
				<Responsive.Item query={isLargeView} render={this.renderFull}  />
				<Responsive.Item query={isMediumView} render={this.renderCompact} type="flyout"  />
				<Responsive.Item query={isSmallView} render={this.renderCompact} type="dialog"  />
			</Responsive.Container>
		);
	}
}

export default View;
