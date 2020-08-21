import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from '@nti/util-logger';
import {LinkTo} from '@nti/web-routing';

//TODO: content acquire prompt

const logger = Logger.get('content:stream:breadcrumb');

function getBreadcrumb (item) {
	return (item || {}).getContextPath ?
		item.getContextPath() :
		Promise.reject('Item doesn\'t have a getContextPath method.');
}

function getTitle (item) {
	const isString = typeof item === 'string';
	const fallback = {title: isString ? item : null};

	let presentation = (item || {}).getPresentationProperties && item.getPresentationProperties();

	if (!presentation) {
		presentation = isString ? fallback : item || fallback;
	}

	return presentation.title || presentation.Title || presentation.displayName;
}

export default class Breadcrumb extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.shape({
			getContextPath: PropTypes.isRequired
		}),

		/**
		 * The context we are viewing the breadcrumb in.
		 * If the context is in the breadcrumb of item
		 * we will only display everything after context.
		 * @type {Object}
		 */
		context: PropTypes.shape({
			NTIID: PropTypes.string
		}),

		/**
		 * If true, the content-aquire-prompt will show on 403 instead of showing the just the course name.
		 * @type {boolean}
		 */
		showPrompt: PropTypes.bool

		//TODO: add the breadcrumb and slicePaths props from mobiles /common/components/BreadcrumbPath
		// breadcrumb: PropTypes.array,
		// splicePaths: PropTypes.number,
	}

	state = {}

	componentDidMount () {
		this.loadBreadcrumb(this.props);
	}

	componentDidUpdate (prevProps) {
		const {item, context} = this.props;
		const {item:prevItem, context:prevContext} = prevProps;

		if (item !== prevItem || context !== prevContext) {
			this.loadBreadcrumb(this.props);
		}
	}


	async loadBreadcrumb (props) {
		const {item, context, showPrompt} = props;

		try {
			const breadcrumbs = await getBreadcrumb(item);
			const breadcrumb = (breadcrumbs || [])[0];
			const indexOfContext = context ? breadcrumb.findIndex((b) => b.NTIID === context.NTIID) : -1;

			this.setState({
				breadcrumb: indexOfContext < 0 ? breadcrumb : breadcrumb.slice(indexOfContext + 1),
				error: null
			});
		} catch (e) {
			if (e && e.statusCode === 403 && e.Items && showPrompt) {
				this.setState({
					breadcrumb: [e.Items],
					error: null
				});
			} else {
				this.setState({
					error: e
				});
			}
		}
	}


	fallbackText (item, error) {
		logger.error('%o Breadcrumb Error: %o', item, error);
		return '';
	}


	render () {
		const {className} = this.props;
		const {breadcrumb, error} = this.state;

		return (
			<div className={cx('nti-content-breadcrumb', className)}>
				{!breadcrumb && !error && this.renderPlaceholder()}
				{error && this.renderError(error)}
				{breadcrumb && !error && this.renderBreadcrumb(breadcrumb)}
			</div>
		);
	}


	renderPlaceholder () {
		const {item} = this.props;

		const width = (w) => ({width: `${w}%`});

		return (
			<LinkTo.Object object={item} className="placeholder">
				<ul className="breadcrumb-list placeholder">
					<li className="crumb" style={width(33)}><span /></li>
					<li className="crumb next-to-last" style={width(22)}><span /></li>
					<li className="crumb last" style={width(45)}><span /></li>
				</ul>
			</LinkTo.Object>
		);
	}


	renderError (error) {
		const {showPrompt, item} = this.props;

		if (showPrompt && error.statusCode === 403) {
			//TODO: render the content acquire prompt
		}

		return (
			<ul className="breadcrumb-list">
				<li>{this.fallbackText(item, error)}</li>
			</ul>
		);
	}


	renderBreadcrumb (breadcrumb) {
		const {item} = this.props;
		const last = breadcrumb.length - 1;
		const nextToLast = breadcrumb.length - 2;

		return (
			<LinkTo.Object object={item}>
				<ul className="breadcrumb-list">
					{
						breadcrumb
							.map((current, index) => {
								const title = getTitle(current);

								if (!title) { return null; }

								const cls = cx('crumb', {
									'next-to-last': index === nextToLast,
									'last': index === last
								});

								return (
									<li key={index} className={cls}>
										<span>{title}</span>
									</li>
								);
							})
					}
				</ul>
			</LinkTo.Object>
		);
	}
}
