import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';
import classnames from 'classnames/bind';

import Annotatable from '../annotatable';

import styles from './Cue.css';

const cx = classnames.bind(styles);

export default class Cue extends React.Component {

	static propTypes = {
		active: PropTypes.bool,
		cue: PropTypes.shape({
			startTime: PropTypes.number.isRequired,
			endTime: PropTypes.number.isRequired,

			// text for cues, image for slides.
			text: PropTypes.string,
			image: PropTypes.string
		}),
		onClick: PropTypes.func,
		onSlideLoaded: PropTypes.func
	}

	onClick = e => {
		const {cue, onClick} = this.props;
		e.preventDefault();

		if (onClick) {
			onClick(cue);
		}
	}

	render () {
		const {
			active,
			className,
			onSlideLoaded,
			cue,
			...others
		} = this.props;
		const cueId = cue.getID ? cue.getID() : null;
		const {startTime, endTime, text, image} = cue;

		let Cmp = null;
		const props = {
			...others,
			onClick: this.onClick,
			'className': cx('cue', {slide: !!image, active}, className),
		};

		if (cueId) {
			Cmp = Annotatable.Anchors.Anchor;
			props.id = cueId;
		} else {
			Cmp = Annotatable.Anchors.TimeAnchor;
			props.startTime = startTime;
			props.endTime = endTime;
		}

		return (
			<Cmp {...props} {...text ? rawContent(text) : {}}>
				{image && (
					<img src={image} onLoad={onSlideLoaded} />
				)}
			</Cmp>
		);
	}

	xrender () {
		const {
			active,
			className,
			onSlideLoaded,
			cue: {startTime, endTime, text, image},
			...others
		} = this.props;

		const props = {
			...others,
			'href': '#',
			'className': cx('cue', {slide: !!image, active}, className),
			'data-start-time': startTime.toFixed(3),
			'data-end-time': endTime.toFixed(3),
			'onClick': this.onClick,
			...(text ? rawContent(text) : {})
		};

		return (
			<a {...props}>
				{image && (
					<img src={image} onLoad={onSlideLoaded} />
				)}
			</a>
		);
	}
}
