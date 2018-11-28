import React from 'react';
import PropTypes from 'prop-types';
import {rawContent, isEmpty} from '@nti/lib-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('content.viewer.content.widget.types.markup-frame.Bar', {
	comment: 'Comment'
});

export default class MarkupFrameBar extends React.Component {
	static propTypes = {
		part: PropTypes.object
	}


	render () {
		const {part: {item, isSlide}} = this.props;
		const {markable, title, caption} = item;

		const noDetails = isEmpty(title) && isEmpty(caption);
		const bare = noDetails && !markable && !isSlide;

		if (bare) { return null; }

		return (
			<span className="bar markupframe-bar" data-non-anchorable="true" data-no-anchors-within="true" unselectable="true">
				{!isSlide ? null : (<a href="#slide" className="bar-cell slide" />)}
				{noDetails && !markable ? null : (
					<span className="bar-cell">
						<span className="image-title" {...rawContent(title)} />
						<span className="image-caption" {...rawContent(caption)} />
						{markable && (
							<a href="#mark" className="mark">
								<i className="icon-discuss" />
								<span className="comment-label">{t('comment')}</span>
							</a>
						)}
					</span>
				)}
			</span>
		);
	}
}
