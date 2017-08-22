import React from 'react';
import PropTypes from 'prop-types';
import { Flyout } from 'nti-web-commons';
import { encodeForURI } from 'nti-lib-ntiids';

export default class TableOfContents extends React.Component {
	static propTypes = {
		toc: PropTypes.object,
		doNavigation: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	attachTOCFlyoutRef = x => this.tocFlyout = x

	HASH_REGEX = /#/

	renderTOC () {
		if(this.props.toc) {
			return (<div className="toc">
				<div className="icon"/>
				<div className="label">Table of Contents</div>
			</div>);
		}

		return (<div className="toc hidden"/>);
	}

	closeHeader = () => {
		this.tocFlyout && this.tocFlyout.dismiss();
	}

	updateSearchValue = (e) => {
		this.setState({searchTerm: e.target.value});
	}

	clearSearchValue = () => {
		this.setState({searchTerm: ''});
	}

	renderTOCHeader () {
		return (<div className="header">
			<div className="search filter">
				<input type="text" placeholder="Search" value={this.state.searchTerm} onChange={this.updateSearchValue}/>
				<div className="clear" onClick={this.clearSearchValue}/>
			</div>
		</div>);
	}

	__findPageNode (node) {
		if (!node || node.tagName === 'toc') {
			return node;
		}

		const href = node && node.getAttribute('href');

		if (this.HASH_REGEX.test(href)) {
			return this.__findPageNode(node.parentNode);
		}

		return node;
	}

	renderTOCItem = (item, index) => {
		const { doNavigation } = this.props;

		const goTo = () => {
			let node = item.get('tocNode'),
				pageNode = this.__findPageNode(node),
				href = node.getAttribute('href'),
				id = pageNode && pageNode.getAttribute('ntiid');

			id = encodeForURI(id);

			if (node !== pageNode && this.HASH_REGEX.test(href)) {
				id += '#' + href.split('#')[1];
			}

			doNavigation && doNavigation(pageNode.getAttribute('label'), id);
		};

		return (<div key={index} className={'outline-row ' + item.get('type')}>
			<div onClick={goTo} className="label">{item.get('label')}</div>
		</div>);
	}

	renderTOCItemList () {
		const { searchTerm } = this.state;
		const { toc } = this.props;

		if(!toc) {
			return null;
		}

		const filtered = searchTerm
			? toc.data.items.filter(i => i.get('label').toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0)
			: toc.data.items;

		return (<div className="outline-list">
			{filtered.map(this.renderTOCItem)}
		</div>);
	}

	render () {
		if(!this.props.toc) {
			return null;
		}

		return (<Flyout.Triggered
			trigger={this.renderTOC()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachTOCFlyoutRef}
		>
			<div className="toc-flyout nav-outline">
				{this.renderTOCHeader()}
				{this.renderTOCItemList()}
			</div>
		</Flyout.Triggered>);
	}
}
