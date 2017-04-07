import React from 'react';
import cx from 'classnames';

const clone = x => typeof x === 'string' ? x : React.cloneElement(x);
const stop = e => (e.preventDefault(), e.stopPropagation());

export default class LinkButton extends React.Component {
	static contextTypes = {
		editorContext: React.PropTypes.shape({
			plugins: React.PropTypes.shape({
				toggleLink: React.PropTypes.func.isRequired,
				currentLink: React.PropTypes.string,
				allowLinks: React.PropTypes.bool
			})
		})
	}

	static propTypes = {
		className: React.PropTypes.string,
		children: React.PropTypes.any
	}


	get editorContext () {
		return this.context.editorContext || {};
	}


	get pluginContext () {
		return this.editorContext.plugins || {};
	}


	get isAllowed () {
		const {allowLinks} = this.pluginContext;

		return allowLinks;
	}


	get isCurrent () {
		const {currentLink} = this.pluginContext;

		return !!currentLink;
	}


	onMouseDown = (e) => {
		const {toggleLink} = this.pluginContext;

		if (e) {
			e.preventDefault();
		}

		if (toggleLink) {
			toggleLink();
		}
	}


	render () {
		const {className} = this.props;
		const {isAllowed, isCurrent} = this;
		const cls = cx('draft-core-link-button', className, {active: isCurrent, disabled: !isAllowed});

		return (
			<button
				className={cls}
				onMouseDown={this.onMouseDown}//onClick is to late
				onClick={stop}
				data-style="link"
				aria-label="link"
			>
				{this.renderLabel()}
			</button>
		);
	}


	renderLabel () {
		const {children} = this.props;

		if (React.Children.count(children) > 0) {
			return React.Children.map(children, x => clone(x));
		}

		return (
			<i className="icon-hyperlink" />
		);
	}
}
