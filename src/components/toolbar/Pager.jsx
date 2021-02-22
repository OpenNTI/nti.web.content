import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import CurrentPage from './CurrentPage';

const t = scoped('content.toolbar.Pager', {
	separator: ' of ',
	goTo: 'Go to %(title)s',
	previous: 'previous',
	next: 'next',
});

// TODO: Use getroute for in the future
export default class Pager extends React.Component {
	static propTypes = {
		doNavigation: PropTypes.func.isRequired,
		hideControls: PropTypes.bool,
		pageSource: PropTypes.shape({
			getPrevious: PropTypes.func.isRequired,
			getPreviousTitle: PropTypes.func.isRequired,
			getPreviousPrecache: PropTypes.func.isRequired,
			getNext: PropTypes.func.isRequired,
			getNextTitle: PropTypes.func.isRequired,
			getNextPrecache: PropTypes.func.isRequired,
			getTotal: PropTypes.func.isRequired,
			previous: PropTypes.any,
			next: PropTypes.any,
		}),
	};

	renderPage() {
		const { doNavigation, pageSource } = this.props;

		if (!pageSource) {
			return null;
		}
		return (
			<div className="page">
				<CurrentPage
					pageSource={pageSource}
					doNavigation={doNavigation}
				/>
				<span className="separator">{t('separator')}</span>
				<span className="total">{pageSource.getTotal()}</span>
			</div>
		);
	}

	goToPrevious = () => {
		const { doNavigation, pageSource } = this.props;

		if (pageSource && pageSource.previous) {
			const previous = pageSource.getPrevious();
			const title = pageSource.getPreviousTitle();
			const precache = pageSource.getPreviousPrecache();
			return doNavigation(title, previous, precache);
		}

		return;
	};

	renderPrev() {
		const { pageSource } = this.props;
		const className =
			'prev' +
			(pageSource && pageSource.previous && pageSource.getPrevious()
				? ''
				: ' disabled');
		return (
			<div
				onClick={this.goToPrevious}
				className={className}
				role="button"
				aria-label={t('previous')}
				title={t('goTo', {
					title: pageSource.getPreviousTitle() ?? t('previous'),
				})}
			/>
		);
	}

	goToNext = () => {
		const { pageSource } = this.props;
		const { doNavigation } = this.props;

		if (pageSource && pageSource.next) {
			const next = pageSource.getNext();
			const title = pageSource.getNextTitle();
			const precache = pageSource.getNextPrecache();
			return doNavigation(title, next, precache);
		}

		return;
	};

	renderNext() {
		const { pageSource } = this.props;
		const className =
			'next' +
			(pageSource && pageSource.next && pageSource.getNext()
				? ''
				: ' disabled');
		return (
			<div
				onClick={this.goToNext}
				className={className}
				role="button"
				aria-label={t('next')}
				title={t('goTo', {
					title: pageSource.getNextTitle() ?? t('next'),
				})}
			/>
		);
	}

	render() {
		if (this.props.hideControls) {
			return null;
		}

		return (
			<div className="non-content-pager controls">
				{this.renderPage()}
				{this.renderPrev()}
				{this.renderNext()}
			</div>
		);
	}
}
