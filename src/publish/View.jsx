import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Prompt, Loading, DialogButtons } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Store from './Store';
import Publication from './options/Publication';

const t = scoped('content.publishing.View', {
	heading: 'Book Visibility',
	loadingError: 'Unable to load content.',
	savingError: 'Unable to change publish state.',
	done: 'Done',
});

class PublishBook extends React.Component {
	static show(content) {
		const Cmp = this;
		let dialog = null;

		const close = () => {
			if (dialog) {
				dialog.dismiss();
			}
		};

		return new Promise(fulfill => {
			dialog = Prompt.modal(
				<Cmp content={content} onDone={fulfill} />,
				{
					className: 'content-publish-window',
				}
			);
		}).finally(() => {
			close();
		});
	}

	static deriveBindingFromProps(props) {
		return props.content;
	}

	static propTypes = {
		content: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
			.isRequired,
		onDone: PropTypes.func,

		contentInstance: PropTypes.object,
		loading: PropTypes.bool,
		error: PropTypes.bool,
	};

	render() {
		const { loading, error, contentInstance } = this.props;

		return (
			<div className="nti-content-publishing">
				{this.renderHeader()}

				<div className="content">
					{loading && !contentInstance && <Loading.Mask />}
					{error &&
						!contentInstance &&
						this.renderLoadingError(error)}

					{error && contentInstance && this.renderSavingError(error)}
					{contentInstance && this.renderOptions(contentInstance)}
				</div>

				{this.renderFooter()}
			</div>
		);
	}

	renderHeader() {
		const { onDone } = this.props;

		return (
			<div className="heading">
				<span className="text">{t('heading')}</span>
				{onDone && <i className="icon-light-x" onClick={onDone} />}
			</div>
		);
	}

	renderFooter() {
		const { onDone } = this.props;

		if (!onDone) {
			return null;
		}

		const buttons = [{ label: t('done'), onClick: onDone }];

		return <DialogButtons buttons={buttons} />;
	}

	renderLoadingError(e) {
		return <span className="loading-error">{t('loadingError')}</span>;
	}

	renderSavingError(e) {
		return (
			<span className="saving-error">
				{(e && e.message) || (e && e.Message) || t('savingError')}
			</span>
		);
	}

	renderOptions() {
		return (
			<div className="options">
				<Publication />
			</div>
		);
	}
}

export default decorate(PublishBook, [
	Store.connect(['loading', 'error', 'contentInstance']),
]);
