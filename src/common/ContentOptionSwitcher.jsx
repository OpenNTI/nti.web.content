import './ContentOptionSwitcher.scss';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Transition = (props) => <CSSTransition classNames="fade-in-out" timeout={400} {...props}/> ;

export const CONTENT = 'content';
export const OPTIONS = 'options';

const DEFAULT_TEXT = {
	showOptions: 'Options',
	showContent: 'Done'
};

const t = scoped('web-content.ContentOptionsSwitcher', DEFAULT_TEXT);

export default class ContentOptionSwitcher extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		content: PropTypes.node,
		options: PropTypes.node,
		hideOptions: PropTypes.bool,
		active: PropTypes.oneOf([CONTENT, OPTIONS]),
		getString: PropTypes.func
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
				<TransitionGroup>
					{active === CONTENT ?
						this.renderContent() :
						this.renderOptions()
					}
				</TransitionGroup>
			</div>
		);
	}


	renderContent () {
		const {content, hideOptions} = this.props;

		return (
			<Transition key="content">
				<div className="content-container">
					{hideOptions ?
						null :
						(
							<div className="show-options toggle" onClick={this.showOptions}>
								<i className="icon-settings small" />
								<span>{this.getString('showOptions')}</span>
							</div>
						)
					}
					{content}
				</div>
			</Transition>
		);
	}


	renderOptions () {
		const {options, hideOptions} = this.props;

		return (
			<Transition key="options">
				<div className="options-container">
					{hideOptions ?
						null :
						(
							<div className="show-content toggle" onClick={this.showContent}>
								<span>{this.getString('showContent')}</span>
							</div>
						)
					}
					{options}
				</div>
			</Transition>
		);
	}
}
