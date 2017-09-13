import React from 'react';
import PropTypes from 'prop-types';
import { Flyout } from 'nti-web-commons';
import {rawContent} from 'nti-commons';

export default class BreadcrumbItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		message: PropTypes.object,
		isRoot: PropTypes.bool,
		isCurrent: PropTypes.bool,
		onClick: PropTypes.func,
		bcKey: PropTypes.number
	}

	attachFlyoutRef = x => this.flyout = x

	constructor (props) {
		super(props);
	}

	renderParent () {
		const { item, isCurrent, isRoot, onClick, bcKey } = this.props;
		if (!item) { return null; }

		let className = 'path part';

		className += isCurrent ? ' current' : '';
		className += isRoot ? ' root' : '';
		className += item.ntiid ? ' link' : '';
		className += item.cls ? ' ' + item.cls : '';

		const clickHandler = () => {
			this.flyout && this.flyout.dismiss();

			onClick && onClick(item);
		};

		if(this.props.message) {
			return (
				<div className="showing-message" key={bcKey}>
					<div
						className={className}
						onClick={clickHandler}
						{...rawContent(item.label)}
					/>
					{this.renderMessage()}
				</div>
			);
		}

		return (
			<div
				className={className}
				onClick={clickHandler}
				key={bcKey}
				{...rawContent(item.label)}
			/>
		);
	}

	renderMessage () {
		const { message } = this.props;

		if(message) {
			const className = message.cls ? 'header-toast ' + message.cls : 'header-toast';

			return (<div className={className}>{message.text}</div>);
		}

		return null;
	}

	renderSibling = (sibling, index) => {
		const { onClick } = this.props;

		const clickHandler = () => {
			this.flyout && this.flyout.dismiss();

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
