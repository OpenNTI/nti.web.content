import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@nti/web-commons';

import Store from './Store';
import StreamItem from './items';
import Sidebar from './sidebar';

@Store.connect({
	loading: 'loading',
	items: 'items',
	error: 'error',
	hasMore: 'hasMore'
})
class View extends React.Component {
	static propTypes = {
		context: PropTypes.shape({
			getStreamDataSource: PropTypes.func.isRequired
		}).isRequired,
		store: PropTypes.shape({
			load: PropTypes.func.isRequired
		}),
		items: PropTypes.array,
		loading: PropTypes.bool
	};

	state = {
		openSearch: true
	};

	componentDidMount () {
		const { context, store } = this.props;

		if (context) {
			store.load(context);
		}
	}

	componentDidUpdate (prevProps) {
		const { context: newContext, store } = this.props;
		const { context: oldContext } = prevProps;

		if (oldContext !== newContext) {
			store.load(newContext);
		}
	}

	onChange = (openSearch) => {
		this.setState({ openSearch });
	}

	render () {
		const { items, context, loading } = this.props;
		const filtered = items && items.filter(item => item && StreamItem.canRender(item));
		const { openSearch } = this.state;

		return (
			<div className="stream-view">
				{loading && (
					<div className="loading-container">
						<Loading.Mask />
					</div>
				)}
				{(!items || items.length === 0) && !loading && (
					<div className="stream-content-empty">
						<div className="stream-empty-container">
							<div className="stream-empty-header">{openSearch ? 'Your notebook is empty.' : 'No Results'}</div>
							<div className="stream-empty-text">{openSearch ? 'Your discussions, bookmarks, and other \n actvity will be collected here.' : 'Try expanding your filters to view more items.'}</div>
						</div>
					</div>
				)}
				{(items && items.length > 0 && !loading) && (
					<ul className="stream-content">
						{filtered.map(item => {
							return (
								<li key={item.NTIID}>
									<StreamItem key={item.NTIID} item={item} context={context} />
								</li>
							);
						})}
					</ul>
				)}
				<div className="stream-sidebar">
					<Sidebar onChange={this.onChange} />
				</div>
			</div>
		);
	}
}

export default View;
