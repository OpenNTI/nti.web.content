import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {rawContent, isEmpty} from '@nti/lib-commons';
import {Card} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

import Registry from './Registry';

const PRESENTATION_CARD = 'presentation-card';

const t = scoped('content.viewer.content.widget.types.MarkupFrame', {
	enlarge: 'Enlarge',
	comment: 'Comment'
});

function getWidth (img, widget) {
	const styleWidth = img && img.style && img.style.width;

	if (styleWidth != null) {
		return parseInt(styleWidth, 10);
	}

	const attrWidth = img.getAttribute('width');

	if (attrWidth != null) {
		return parseInt(attrWidth, 10);
	}

	return widget ? widget.clientWidth : Infinity;
}

@Registry.register(Registry.buildHandler(/nti-data-markup(dis|en)abled/i))
class MarkupFrameWidget extends React.Component {
	static propTypes = {
		part: PropTypes.object
	}

	state = {}

	attachImage = (img) => {
		this.image = img;
	}


	onZoom = () => {}


	onLoad = () => {}


	render () {
		const {zoomed} = this.state;

		return (
			<>
				{this.renderFrame()}
				{zoomed && (this.renderZoomed())}
			</>
		);
	}


	renderFrame () {
		const {part: {item, itemprop, isSlide, parentType}, node} = this.props;
		const {forceZoomable} = this.state;
		const {zoomable, markable, title, caption, dom} = item;
		const isZoomable = zoomable || forceZoomable;
		const width = getWidth(dom, node);

		const noDetails = isEmpty(title) && isEmpty(caption);
		const bare = noDetails && !markable && !isSlide;
		const isCard = parentType === PRESENTATION_CARD;
		const isNarrow = !isCard && width < 116;
		const styles = {};

		const cls = cx('markupframe', {bare, card: isCard, 'is-zoomable': isZoomable});

		if (!isCard && width > 30 && width < Infinity) {
			styles.width = `${width}px`;
		}

		return (
			<span itemProp={itemprop} className={cls} onClick={this.onZoom} style={styles}>
				<span className="wrapper">
					{!zoomable || isCard ? null : (
						<a title={t('enlarge')} className="zoom" data-non-anchorable="true">
							<i className="icon-search" />
						</a>
					)}
					<img id={item.id} src={item.src} crossOrigin={item.crossorigin} ref={this.attachImage} onLoad={this.onLoad} />
				</span>
				{bare ? null : (
					<span className="bar" data-non-anchorable="true" data-no-anchors-within="true" unselectable="true">
						{!isSlide ? null : (<a href="#slide" className="bar-cell slide" />)}
						{noDetails && !markable ? null : (
							<span className="bar-cell">
								<span className="image-title" {...rawContent(title)} />
								<span className="image-caption" {...rawContent(caption)} />
								{markable && (
									<a href="#mark" className="mark">
										<i className="icon-create" />
										<span>{!isNarrow && t('comment')}</span>
									</a>
								)}
							</span>
						)}
					</span>
				)}
				{isCard && (
					<>
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
						{markable && (<a href="#mark" className="mark" />)}
					</>
				)}
			</span>
		);
	}


	renderZoomed () {

	}
}

export {MarkupFrameWidget as default};
