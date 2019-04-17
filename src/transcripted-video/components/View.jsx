import React from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI} from '@nti/lib-ntiids';
import classnames from 'classnames/bind';

import Store from '../Store';

import Content from './Content';
import Sidebar from './Sidebar';
import styles from './View.css';

const cx = classnames.bind(styles);

export default
@Store.connect()
class View extends React.Component {

	static deriveBindingFromProps = ({course, videoId, outlineId}) => ({
		course,
		videoId: decodeFromURI(videoId),
		outlineId: decodeFromURI(outlineId)
	})

	static propTypes = {
		course: PropTypes.object.isRequired,
		videoId: PropTypes.string.isRequired,
		outlineId: PropTypes.string,
		analyticsData: PropTypes.object,
		disableNoteCreation: PropTypes.bool,
		autoPlay: PropTypes.bool,
		scrolledTo: PropTypes.oneOfType([
			PropTypes.string, // note id
			PropTypes.shape({ // model
				getID: PropTypes.func.isRequired
			})
		])
	}

	render () {
		const {
			course,
			videoId,
			outlineId,
			scrolledTo,
			disableNoteCreation,
			autoPlay,
			analyticsData
		} = this.props;

		const props = {
			course,
			videoId,
			outlineId
		};

		return (
			<div className={cx('transcripted-video')}>
				<Content {...props} disableNoteCreation={disableNoteCreation} autoPlay={autoPlay} analyticsData={analyticsData} scrolledTo={scrolledTo}/>
				<Sidebar {...props} />
			</div>
		);
	}
}
