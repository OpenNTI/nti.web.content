import React from 'react';
import PropTypes from 'prop-types';

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
		items: PropTypes.array
	};

	state = {};

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

	render () {
		const { items, context } = this.props;

		if (!items || items.length === 0) {
			return (
				<div>empty</div>
			);
		}

		const filtered = items.filter(item => item && StreamItem.canRender(item));

		return (
			<div className="stream-view">
				<div className="stream-content">
					{filtered.map(item => <StreamItem key={item.NTIID} item={item} context={context} />)}
				</div>
				<div className="stream-sidebar">
					<Sidebar />
				</div>
			</div>
		);
	}
}

export default View;
