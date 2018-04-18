import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Search, Loading, Error as Err, Banner} from '@nti/web-commons';

import TableOfContents from './TableOfContents';

export default class TableOfContentsView extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object.isRequired,
		banner: PropTypes.bool,
		onSelectNode: PropTypes.func
	}

	state = {loading: true}


	componentWillReceiveProps (nextProps) {
		const {contentPackage:nextPack} = nextProps;
		const {contentPackage:prevPack} = this.props;

		if (nextPack !== prevPack) {
			this.fillIn(nextProps);
		}
	}


	componentDidMount () {
		this.fillInTocs(this.props);
	}


	async fillInTocs (props = this.props) {
		this.setState({loading: true, error: false});

		const {contentPackage} = props;

		try {
			const tocs = await contentPackage.getTablesOfContents();

			this.setState({loading: false, tocs});
		} catch (e) {
			this.setState({error: e});
		}

	}


	updateFilter = (filter) => {
		this.setState({filter});
	}


	render () {
		const {loading} = this.state;

		return (
			<div className={cx('table-of-contents-view', {loading})}>
				{loading && (<Loading.Mask />)}
				{!loading && this.renderBranding()}
				{!loading && this.renderSearch()}
				{!loading && this.renderError()}
				{!loading && this.renderTocs()}
			</div>
		);
	}


	renderError () {
		const {error} = this.state;

		return !error ? null : (<Err error={error} />);
	}


	renderBranding () {
		const {banner, contentPackage} = this.props;

		return !banner ?
			null :
			(
				<Banner item={contentPackage} className="head">
					<div className="branding" />
				</Banner>
			);
	}


	renderSearch () {
		return (
			<Search onChange={this.updateFilter} />
		);
	}


	renderTocs () {
		const {onSelectNode} = this.props;
		const {tocs, filter} = this.state;
		const isSingle = tocs.length === 1;
		const cls = cx({'single-root': isSingle, 'multi-root': !isSingle});

		return (
			<ul className="contents">
				{tocs.map((toc, key) => {
					return (
						<li key={key}>
							<h1 className={cls}>Package: {toc.title}</h1>
							<TableOfContents toc={toc} filter={filter} onSelectNode={onSelectNode} />
						</li>
					);
				})}
			</ul>
		);
	}
}
