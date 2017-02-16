import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export const CONTENT = 'content';
export const OPTIONS = 'options';

const DEFAULT_TEXT = {
	showOptions: 'Options',
	showContent: 'Done'
};

const t = scoped('CONTENT_OPTIONS_SWITCHER', DEFAULT_TEXT);

export default class ContentOptionSwitcher extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		content: React.PropTypes.node,
		options: React.PropTypes.node,
		active: React.PropTypes.oneOf([CONTENT, OPTIONS]),
		getString: React.PropTypes.func
	}


	static defaultProps = {
		active: CONTENT
	}

	constructor (props) {
		super(props);

		const {active} = props;

		this.state = {
			active: active
		};
	}

	get getString () {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}


	componentWillReceiveProps (nextProps) {
		const {active:nextActive} = nextProps;
		const {active:oldActive} = this.props;

		if (nextActive !== oldActive) {
			this.setState({active:nextActive});
		}
	}


	showContent = () => {
		this.setState({
			active: CONTENT
		});
	}


	showOptions = () => {
		this.setState({
			active: OPTIONS
		});
	}


	render () {
		const {className} = this.props;
		const {active} = this.state;
		const cls = cx('content-option-switcher', className, {active});

		return (
			<div className={cls}>
				<ReactCSSTransitionGroup transitionName='fadeInOut' transitionEnterTimeout={400} transitionLeaveTimeout={400}>
					{active === CONTENT ?
						this.renderContent() :
						this.renderOptions()
					}
				</ReactCSSTransitionGroup>
			</div>
		);
	}


	renderContent () {
		const {content} = this.props;

		return (
			<div className="content-container" key="content">
				<div className="show-options toggle" onClick={this.showOptions}>
					<i className="icon-settings small" />
					<span>{this.getString('showOptions')}</span>
				</div>
				{content}
			</div>
		);
	}


	renderOptions () {
		const {options} = this.props;

		return (
			<div className="options-container" key="options">
				<div className="show-content toggle" onClick={this.showContent}>
					<span>{this.getString('showContent')}</span>
				</div>
				{options}
			</div>
		);
	}
}
