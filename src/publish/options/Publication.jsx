import './Publication.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Input } from '@nti/web-commons';

import Store from '../Store';

const t = scoped('content.publish.Publication', {
	label: 'Visible in Library',
});

class BookPublishPublication extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		published: PropTypes.bool,
		canPublish: PropTypes.bool,
		canUnpublish: PropTypes.bool,
		publish: PropTypes.func,
		unpublish: PropTypes.func,
	};

	onChange = published => {
		const { publish, unpublish, canPublish, canUnpublish } = this.props;

		if (published && canPublish) {
			publish();
		} else if (!published && canUnpublish) {
			unpublish();
		}
	};

	render() {
		const { published, loading, canPublish, canUnpublish } = this.props;
		const canChange =
			(published && canUnpublish) || (!published && canPublish);

		return (
			<div
				className={cx('content-publish-publication', {
					'can-change': !loading && canChange,
				})}
			>
				<div className="label">{t('label')}</div>
				<div className="input-container">
					<Input.Toggle value={published} onChange={this.onChange} />
				</div>
			</div>
		);
	}
}

export default decorate(BookPublishPublication, [
	Store.monitor([
		'loading',
		'published',
		'canPublish',
		'canUnpublish',
		'publish',
		'unpublish',
	]),
]);
