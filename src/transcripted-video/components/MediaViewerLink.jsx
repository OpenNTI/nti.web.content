import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';
import classnames from 'classnames/bind';

import styles from './MediaViewerLink.css';

const cx = classnames.bind(styles);

export default function MediaViewerLink ({video, ...others}) {
	return !video ? null : (
		<LinkTo.Object object={video} context={{mediaViewer: true}} className={cx('media-viewer-link')}>
			<span className={cx('icon')} />
			<span className={cx('label')}>Media Viewer</span>
		</LinkTo.Object>
	);
}

MediaViewerLink.propTypes = {
	video: PropTypes.object
};
