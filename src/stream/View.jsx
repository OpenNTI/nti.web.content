import React from 'react';
import PropTypes from 'prop-types';
import { Layouts, Stream, StickyContainer, StickyElement } from '@nti/web-commons';

import Store from './Store';
import Sidebar from './sidebar';
import Page from './Page';
import { ThoughtPrompt, Loading } from './components';

const { InfiniteLoad, Responsive } = Layouts;
const PAGE_HEIGHT = 400;
const { DATE_FILTER_VALUES } = Stream;

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
		typeOptions: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string
		})),
		sortByOptions: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string
		})),
	};

	static defaultProps = {
		typeOptions: [
			{ label: 'Notes', value: 'NOTES' },
			{ label: 'Bookmarks', value: 'BOOKMARKS' },
			{ label: 'Highlights', value: 'HIGHLIGHTS' },
			{ label: 'Likes', value: 'LIKES' }
		],
		sortByOptions: [
			{ label: 'Date Created', value: 'CreatedTime' },
			{ value: 'LastModified', label: 'Recent Activity' },
			{ value: 'ReferencedByCount', label: 'Most Commented' },
			{ value: 'LikeCount', label: 'Most Liked' }
		]
	}

	constructor (props) {
		super(props);
		let types = {};
		props.typeOptions.forEach(x => types[x.value] = true);

		this.state = {
			openSearch: true,
			params: {
				types,
				batchAfter: DATE_FILTER_VALUES.ANYTIME,
				sortOn: props.sortByOptions[0].value,
				sortOrder: SORT_ORDER.DESCENDING
			}
		};
	}

	componentDidMount () {
		const { context } = this.props;

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

	renderPage = props => (
		<Page {...props} context={this.props.context} />
	)

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

	renderStream = () => {
		const { store } = this.state;
		return (
			<div className="stream-infinite-scroll">
				{!store && <Loading />}
				{store && (
					<InfiniteLoad.Store
						store={store}
						defaultPageHeight={PAGE_HEIGHT}
						renderPage={this.renderPage}
						renderLoading={() => <Loading />}
						renderEmpty={this.renderEmpty}
					/>
				)}
			</div>
		);
	}

	renderCompact = ({ type }) => {
		const { params, showDialog } = this.state;
		const { typeOptions, sortByOptions } = this.props;
		return (
			<div className="compact">
				<Sidebar
					type={type}
					onChange={this.onChange}
					params={params}
					onDialogVisibilityChange={newVisibility => this.setState({showDialog: newVisibility})}
					typeOptions={typeOptions}
					sortByOptions={sortByOptions}
				/>
				{!showDialog && this.renderStream()}
			</div>
		);
	}

	renderFull = () => {
		const { params } = this.state;
		const { typeOptions, sortByOptions, showThought } = this.props;
		return (
			<StickyContainer>
				<Layouts.NavContent.Container className="stream-view">
					<Layouts.NavContent.Content className="content">
						{showThought && <ThoughtPrompt />}
						{this.renderStream()}
					</Layouts.NavContent.Content>
					<Layouts.NavContent.Nav className="nav-bar">
						<StickyElement>
							<Sidebar
								onChange={this.onChange}
								params={params}
								typeOptions={typeOptions}
								sortByOptions={sortByOptions}
							/>
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
