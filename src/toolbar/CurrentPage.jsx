import React from 'react';
import PropTypes from 'prop-types';
import { Input, VisibleComponentTracker } from '@nti/web-commons';

export default class CurrentPage extends React.Component {
	static propTypes = {
		allPages: PropTypes.array,
		currentPage: PropTypes.string,
		toc: PropTypes.shape({
			getRealPage: PropTypes.func.isRequired
		}).isRequired
	}

	static contextTypes = {
		router: PropTypes.shape({
			routeTo: PropTypes.shape({
				object: PropTypes.func.isRequired
			}).isRequired
		}).isRequired
	}

	state = {
		currentPage: 0
	}

	componentDidMount () {
		const { allPages } = this.props;

		this.setupFor(this.props);

		if (allPages) {
			VisibleComponentTracker.addGroupListener('real-page-numbers', this.onVisibleChange);
		}
	}

	componentDidUpdate (prevProps) {
		const {currentPage} = this.props;
		const {currentPage: prevCurrentPage} = prevProps;

		if (currentPage !== prevCurrentPage) {
			this.setupFor(this.props);
		}
	}

	componentWillUnmount () {
		const { allPages } = this.props;

		if (allPages) {
			VisibleComponentTracker.removeGroupListener('real-page-numbers', this.onVisibleChange);
		}
	}

	setupFor (props = this.props) {
		this.setState({ currentPage: props.currentPage });
	}

	onVisibleChange = (visible) => {
		const page = visible && visible[0] && visible[0].data.pageNumber;

		if (page) {
			this.setState({ currentPage: page });
		}
	}

	selectPage = (page) => {
		const { toc } = this.props;
		const realPage = toc.getRealPage(page);
		this.context.router.routeTo.object(realPage);
	}

	renderSinglePage = () => <span className="current-page">{this.state.currentPage}</span>;

	renderAllPages = () => {
		const { currentPage } = this.state;
		const { allPages } = this.props;

		return (
			<Input.Select className="page-select" optionsClassName="page-select-options-list" value={currentPage} searchable onChange={this.selectPage}>
				{allPages.map(({page}, key) => (<Input.Select.Option key={key} value={page}>{page}</Input.Select.Option>))}
			</Input.Select>
		);
	}

	render () {
		return (
			<div className="nti-content-toolbar-pager-currentPage">
				{this.props.allPages ? this.renderAllPages() : this.renderSinglePage()}
			</div>
		);
	}
}
