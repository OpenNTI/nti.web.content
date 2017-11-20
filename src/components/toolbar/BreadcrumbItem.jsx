import React from 'react';
import PropTypes from 'prop-types';
import { Flyout } from 'nti-web-commons';
import {rawContent} from 'nti-commons';

class Sibling extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		onClick: PropTypes.func
	}

	onClick = () => {
		const {onClick, item} = this.props;
		onClick && onClick(item);
	}

	render () {
		const {item} = this.props;
		return (
			<div onClick={this.onClick} className="sibling-item" {...rawContent(item.label)}/>
		);
	}
}

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


	forceDismissFlyout = () => this.flyout && this.flyout.dismiss();


	onClick = (item) => {
		const {onClick} = this.props;
		this.forceDismissFlyout();

		if (onClick) {
			onClick(item);
		}
	}


	onParentClick = () => {
		this.onClick(this.props.item);
	}


	renderParent () {
		const { item, isCurrent, isRoot, bcKey } = this.props;
		if (!item) { return null; }

		let className = 'path part';

		className += isCurrent ? ' current' : '';
		className += isRoot ? ' root' : '';
		className += item.ntiid ? ' link' : '';
		className += item.cls ? ' ' + item.cls : '';

		if(this.props.message) {
			return (
				<div className="showing-message" key={bcKey}>
					<div
						className={className}
						onClick={this.onParentClick}
						{...rawContent(item.label)}
					/>
					{this.renderMessage()}
				</div>
			);
		}

		return (
			<div
				className={className}
				onClick={this.onParentClick}
				key={bcKey}
				{...rawContent(item.label)}
			/>
		);
	}


	renderMessage () {
		const { message } = this.props;

		if(message) {
			const className = message.cls ? 'header-toast ' + message.cls : 'header-toast';

			return (
				<div className={className}>{message.text}</div>
			);
		}

		return null;
	}



	render () {
		const { item } = this.props;

		if(!item) {
			return null;
		}

		if(item.siblings) {
			return (
				<Flyout.Triggered
					className="breadcrumb-sibling-menu"
					trigger={this.renderParent()}
					hover
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
					ref={this.attachFlyoutRef}
				>
					<div className="breadcrumb-dropdown-view">
						{item.siblings.map((x, i) => (
							<Sibling item={x} key={i} onClick={this.onClick}/>
						))}
					</div>
				</Flyout.Triggered>
			);
		}
		else {
			return this.renderParent();
		}
	}
}
