import React from 'react';
import {Component as Video} from '@nti/web-video';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';
import {getScreenHeight, getScrollParent} from '@nti/lib-dom';

import Registry from './Registry';

const REF_CLASS = 'ntivideoref';

const DEFAULT_TEXT = {
	error: 'Video not found.'
};

const t = scoped('web-content.widgets.video', DEFAULT_TEXT);


function getVideo (object, index) {
	const {NTIID = object.ntiid} = object;

	if (object.getID) {
		return object;
	}

	return NTIID ? index.get(NTIID) : index.mediaFrom(object);
}


async function getVideoRef (object) {
	const service = await getService();

	return service.getObject(object.NTIID || object.ntiid);
}


function listen (context, action) {
	const p = getScrollParent(context.el);
	p[action]('scroll', context.maybeRenderVideo, false);
	if (p !== global) {
		global[action]('scroll', context.maybeRenderVideo, false);
	}
}


const inView = y => y >= 0 && y <= getScreenHeight();

export default
@Registry.register(Registry.buildHandler(/ntivideoref/))
class VideoWidget extends React.Component {
	static propTypes = {
		part: PropTypes.object.isRequired,
		contentPackage: PropTypes.object.isRequired
	}

	attachRef = (x) => this.el = x
	attachVideoRef = (x) => this.video = x


	state = { loading: false, error: false, video: false }

	onError (error) {
		this.setState({
			loading: false,
			playing: false,
			video: null,
			error
		});
	}


	componentDidMount () {
		this.fillInVideo(this.props);
		listen(this, 'addEventListener');
		this.maybeRenderVideo();
	}


	componentWillUnmount () {
		listen(this, 'removeEventListener');
	}


	componentDidUpdate (prevProps) {
		const {contentPackage, part} = this.props;

		if (part !== prevProps.part || contentPackage !== prevProps.contentPackage) {
			this.fillInVideo(this.props);
			this.setState({playing: false});
		}
	}


	getVideoID (props) {
		const part = (props || this.props).part;

		return part.NTIID || (part.dataset || {}).ntiid;
	}


	fillInVideo  (props) {
		try {
			const {state: {video}} = this;
			const {contentPackage, part} = props;

			if (video && part.NTIID === video.getID()) {
				return;
			}

			if (part.Class === REF_CLASS) { return this.fillInVideoRef(props); }

			this.setState({loading: true});

			this.getVideo(part)
				.catch(() => contentPackage && contentPackage.getVideoIndex()
					.catch(() => null)
					.then(index => getVideo(part, index)))

				.then(v => {
					v.getPoster()
						.then(poster=>
							this.setState({
								video: v,
								loading: false,
								poster
							}));
				})
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	}


	fillInVideoRef (props) {
		const {part} = props;

		getVideoRef(part)
			.then((v) => {
				v.getPoster()
					.then(poster => {
						this.setState({
							video: v,
							loading: false,
							poster
						});
					});
			})
			.catch(this.onError);
	}


	onPosterClicked (e) {
		e.stopPropagation();
		this.onPlayClicked(e);
	}


	onPlayClicked (e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({requestPlay: true}, () => {

			const {video} = this;
			if (video) {
				video.play();
			}

		});
	}


	stop () {
		const {video} = this;
		if (video) {
			video.stop();
		}
	}


	onStop () {
		if (this.video) {
			this.setState({playing: false});
		}
	}


	onPlay  () {
		if (this.video) {
			this.setState({playing: true});
		}
	}


	maybeRenderVideo () {
		const {el, state: {requestPlay}} = this;
		if (!el || requestPlay) { return; }

		const {top, bottom} = el.getBoundingClientRect();

		if ([top, bottom].some(inView)) {
			this.setState({requestPlay: true});
		}
	}


	render () {
		const {
			props: {part},//, tag = 'div', onFocus},
			state: {loading, playing, poster, video, requestPlay, error}
		} = this;

		const label = part.label || part.title || (video && video.title);

		const Tag = 'div';

		const posterRule = poster && {backgroundImage: `url(${poster})`};

		return (
			<Tag ref={this.attachRef} className="content-video video-wrap" data-ntiid={this.getVideoID()}>
				{error && (
					<div className="error">
						<span>{t('error')}</span>
					</div>
				)}

				{!video || !requestPlay || error ? null : (
					<Video ref={this.attachVideoRef} src={video}
						onEnded={this.onStop}
						onPause={this.onStop}
						onPlaying={this.onPlay}
						analyticsData={{
							resourceId: this.getVideoID(),
							context: this.state.context
						}}
					/>
				)}

				{(playing || requestPlay || error) ? null : (
					<Loading.Mask style={posterRule} loading={loading}
						tag="a" onClick={this.onPosterClicked}
						className="content-video-tap-area" href="#">

						{/* {viewed && <div className="viewed">Viewed</div>} */}

						<div className="wrapper">
							<div className="buttons">
								<span className="play" title="Play" onClick={this.onPlayClicked}/>
								<span className="label" title={label}>{label}</span>
							</div>
						</div>
					</Loading.Mask>
				)}
			</Tag>
		);
	}
}
