import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Card, Zoomable} from '@nti/web-commons';
import {rawContent, isEmpty} from '@nti/lib-commons';

import Registry from './Registry';

const PRESENTATION_CARD = 'presentation-card';

@Registry.register(Registry.buildHandler(/nti-data-markup(dis|en)abled/i))
class MarkupFrameWidget extends React.Component {
	propTypes = {
		part: PropTypes.object
	}

	attachRef = x => this.image = x


	state = { zoomed: false }


	onZoom = () => {
		const {image} = this;
		if(image && image.src) {
			this.setState({
				zoomed: true
			});
		}
	}


	unZoom = () => {
		this.setState({
			zoomed: false
		});
	}


	onLoad = () => {
		const {image: i} = this;
		if (i) {
			this.setState({forceZoomable: true});
		}
	}


	render () {
		let {item, itemprop, isSlide, parentType} = this.props.part;

		let {zoomable, markable} = item;

		let title = item.title;
		let caption = item.caption;

		let noDetails = isEmpty(title) && isEmpty(caption);
		let bare = noDetails && !markable && !isSlide;

		const isCard = parentType === PRESENTATION_CARD;

		//force zoom if the image has been scaled down and only if the frame will show.
		if (this.state.forceZoomable) {
			zoomable = true;
		}

		//FIXME: The Item may not be an image, it could also be a video embed, a slide, or an iframe.

		const className = cx('markupframe', {bare, card: isCard});

		return (
			<span itemProp={itemprop} className={className}>
				<span onClick={this.onZoom}>
					<span className="wrapper">
						<img id={item.id} src={item.src} crossOrigin={item.crossorigin} ref={this.attachRef} onLoad={this.onLoad}/>
						{!zoomable || isCard ? null : (
							<a title="Zoom"
								className="zoom icon-search"
								data-non-anchorable="true"
								onClick={this.onZoom} />
						)}
					</span>

					{bare ? null : (
						<span className="bar" data-non-anchorable="true" data-no-anchors-within="true" unselectable="true">
							{!isSlide ? null : ( <a href="#slide" className="bar-cell slide"/> )}
							{noDetails && !markable ? null : (
								<span className="bar-cell">
									<span className="image-title" {...rawContent(title)}/>
									<span className="image-caption" {...rawContent(caption)}/>
									{markable && ( <a href="#mark" className="mark"/> )}
								</span>
							)}
						</span>
					)}

					{isCard && (
						<Fragment>
							<Card
								internalOverride
								onClick={this.onZoom}
								icon={item.src}
								item={{
									title,
									desc: caption,
									icon: item.src
								}}
							/>
							{markable && ( <a href="#mark" className="mark"/> )}
						</Fragment>
					)}
				</span>
				{this.state.zoomed && <Zoomable src={item.src} onClose={this.unZoom} />}
			</span>
		);
	}
}

export {MarkupFrameWidget as default};
