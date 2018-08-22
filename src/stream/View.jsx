import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Layouts } from '@nti/web-commons';

import Store from './Store';
import Sidebar from './sidebar';
import Page from './Page';

const { InfiniteLoad } = Layouts;
const PAGE_HEIGHT = 210;

class View extends React.Component {
	static propTypes = {
		context: PropTypes.shape({
			getStreamDataSource: PropTypes.func.isRequired
		}).isRequired,
	};

	state = {
		openSearch: true,
	};

	componentDidMount () {
		const { context} = this.props;

		if (context) {
			this.setState({
				store: new Store(context)
			});
		}
	}

	componentDidUpdate (prevProps) {
		const { context: newContext } = this.props;
		const { context: oldContext } = prevProps;

		if (oldContext !== newContext) {
			this.setState({
				store: new Store(newContext)
			});
		}
	}

	onChange = (params, openSearch) => {
		this.setState({
			openSearch,
			store: null
		}, () => {
			this.setState({ store: new Store(this.props.context, params)});
		});
	}

	renderPage = (props) => {
		const { context } = this.props;

		return (
			<Page {...props} context={context} />
		);
	}

	renderEmpty () {
		const { openSearch } = this.state;
		return (
			<div className="stream-content-empty">
				<div className="stream-empty-container">
					<div className="stream-empty-header">{openSearch ? 'Your notebook is empty.' : 'No Results'}</div>
					<div className="stream-empty-text">{openSearch ? 'Your discussions, bookmarks, and other \n actvity will be collected here.' : 'Try expanding your filters to view more items.'}</div>
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

	render () {
		const { store } = this.state;

		return (
			<Layouts.NavContent.Container className="stream-view">
				<Layouts.NavContent.Content className="content">
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
				</Layouts.NavContent.Content>
				<Layouts.NavContent.Nav className="nav-bar">
					<Sidebar onChange={this.onChange} />
				</Layouts.NavContent.Nav>
			</Layouts.NavContent.Container>
		);
	}
}

export default View;
