import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from '@nti/lib-commons';
import {Card, Prompt, ZoomableContent} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

import Registry from '../Registry';

import Bar from './Bar';
import Zoomed from './Zoomed';

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


	onZoom = () => {
		if (this.image && this.image.src) {
			this.setState({
				zoomed: true
			});
		}
	}


	onZoomClosed = () => {
		this.setState({
			zoomed: false
		});
	}


	onLoad = () => {}


	render () {
		const {part: {item, itemprop, isSlide, parentType}, node} = this.props;
		const {zoomed} = this.state;
		const {zoomable, markable, title, caption, dom} = item;
		const isZoomable = zoomable || markable;
		const width = getWidth(dom, node);

		const noDetails = isEmpty(title) && isEmpty(caption);
		const bare = noDetails && !markable && !isSlide;
		const isCard = parentType === PRESENTATION_CARD;
		const isNarrow = !isCard && width < 116;
		const styles = {};

		const cls = cx('markupframe', {bare, card: isCard, 'is-zoomable': isZoomable, 'is-narrow': isNarrow});

		if (!isCard && width > 30 && width < Infinity) {
			styles.width = `${width}px`;
		}

		return (
			<span itemProp={itemprop} className={cls} onClick={this.onZoom} style={styles}>
				<span className="wrapper">
					{!isZoomable || isCard ? null : (
						<a title={t('enlarge')} className="zoom" data-non-anchorable="true">
							<i className="icon-search" />
						</a>
					)}
					<img id={item.id} src={item.src} crossOrigin={item.crossorigin} ref={this.attachImage} onLoad={this.onLoad} />
				</span>
				<Bar {...this.props} />
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
				{zoomed && (<Zoomed onClose={this.onZoomClosed} {...this.props} />)}
			</span>
		);
	}
}

export {MarkupFrameWidget as default};
