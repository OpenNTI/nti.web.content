import React from 'react';
import PropTypes from 'prop-types';
import { Flyout } from 'nti-web-commons';
import {rawContent} from 'nti-commons';

export default class BreadcrumbItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		current: PropTypes.bool,
		onClick: PropTypes.func,
		bcKey: PropTypes.number
	}

	attachFlyoutRef = x => this.flyout = x

	constructor (props) {
		super(props);
	}

	renderParent () {
		const { item, current, onClick, bcKey } = this.props;
		if (!item) { return null; }

		let className = 'path part';

		if(current) {
			className += ' current';
		}

		if(item.ntiid) {
			className += ' link';
		}

		className += ' ' + item.cls;

		const clickHandler = () => {
			onClick && onClick(item);
		};

		return (
			<div
				className={className}
				onClick={clickHandler}
				key={bcKey}
				{...rawContent(item.label)}
			/>
		);
	}

	renderSibling = (sibling, index) => {
		const { onClick } = this.props;

		const clickHandler = () => {
			onClick && onClick(sibling);
		};

		return (<div key={index} onClick={clickHandler} className="sibling-item" {...rawContent(sibling.label)}/>);
	}

	render () {
		const { item } = this.props;

		if(!item) {
			return null;
		}

		if(item.siblings) {
			return (<Flyout.Triggered
				className="breadcrumb-sibling-menu"
				trigger={this.renderParent()}
				hover
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachFlyoutRef}
			>
				<div>
					{item.siblings.map(this.renderSibling)}
				</div>
			</Flyout.Triggered>);
		}
		else {
			return this.renderParent();
		}
	}
}
