import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {rawContent} from '@nti/lib-commons';

export default class Transcript extends React.Component {

	static propTypes = {
		children: PropTypes.any,

		cues: PropTypes.arrayOf(
			PropTypes.shape({
				endTime: PropTypes.number,
				startTime: PropTypes.number,
				text: PropTypes.string
			})),

		slides: PropTypes.arrayOf(
			PropTypes.shape({
				endTime: PropTypes.number,
				startTime: PropTypes.number,
				image: PropTypes.string
			})),

		currentTime: PropTypes.number,

		onJumpTo: PropTypes.func,
		onSlideLoaded: PropTypes.func
	}

	static defaultProps = {
		onJumpTo: () => {},
		onSlideLoaded: () => {}
	}

	attachRef = x => this.node = x

	componentWillUnmount () {
		this.unmounted = true;
	}

	onJumpToCue = (e) => {
		e.preventDefault();
		this.props.onJumpTo(e.target.getAttribute('data-start-time'));
	}

	renderCues = (cue) => {
		const divider = null;
		const time = this.props.currentTime;

		const cs = cx({active: cue.startTime < time && time <= cue.endTime});

		//There is HTML escaped text in the cue, so we have to
		// use: "dangerouslySetInnerHTML={{__html: ''}}"
		return [
			divider, (
				<a href="#" key={cue.startTime}
					data-start-time={cue.startTime.toFixed(3)}
					data-end-time={cue.endTime.toFixed(3)}
					className={cs}
					onClick={this.onJumpToCue}
					{...rawContent(cue.text)}/>
			)];
	}

	renderSlide = (slide) => {
		let divider = null;
		let time = this.props.currentTime;

		const cs = cx('slide', {active: slide.startTime < time && time <= slide.endTime});

		return [
			divider, (
				<a href="#" key={`slide-${slide.startTime.toFixed(3)}`}
					data-start-time={slide.startTime.toFixed(3)}
					data-end-time={slide.endTime.toFixed(3)}
					className={cs}
					onClick={this.onJumpToCue}>
					<img src={slide.image} className="slide" onLoad={this.props.onSlideLoaded}/>
				</a>
			)];
	}

	renderItem = (item) => {
		return ('text' in item) ? this.renderCues(item) : this.renderSlide(item);
	}

	render () {
		const {cues = [], slides = [], children} = this.props;

		const items = cues.concat(slides).sort((a, b) => a.startTime - b.startTime);

		return (
			<div className="cues" ref={this.attachRef}>
				{items.map(this.renderItem)}
				{children}
			</div>
		);
	}
}
