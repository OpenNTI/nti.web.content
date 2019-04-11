import React from 'react';
import PropTypes from 'prop-types';
import {Layouts} from '@nti/web-commons';
import {decodeFromURI} from '@nti/lib-ntiids';
import classnames from 'classnames/bind';

import Content from './Content';
import Sidebar from './Sidebar';
import styles from './View.css';

const cx = classnames.bind(styles);

export default class View extends React.Component {

	static deriveBindingFromProps = ({course, videoId, outlineId}) => ({
		course,
		videoId: decodeFromURI(videoId),
		outlineId: decodeFromURI(outlineId)
	})

	static propTypes = {
		course: PropTypes.object.isRequired,
		videoId: PropTypes.string.isRequired,
		outlineId: PropTypes.string,
		disableNoteCreation: PropTypes.bool,
	}

	render () {
		const {
			course,
			videoId,
			outlineId,
			disableNoteCreation
		} = this.props;

		const props = {
			course,
			videoId,
			outlineId
		};

		return (
			<div className={cx('transcripted-video')}>
				<Content {...props} disableNoteCreation={disableNoteCreation} />
				<Sidebar {...props} />
			</div>
		);
	}
}
