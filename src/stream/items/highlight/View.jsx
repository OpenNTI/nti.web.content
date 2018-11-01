import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DateTime, DisplayName, Ellipsed, Presentation } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';

import Registry from '../Registry';
import {Breadcrumb} from '../components';

@Registry.register('application/vnd.nextthought.highlight')
class Highlight extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			presentationProperties: PropTypes.shape({
				highlightColorName: PropTypes.string
			}),
			creator: PropTypes.string,
			selectedText: PropTypes.string,
			getCreatedTime: PropTypes.func.isRequired
		}),
		context: PropTypes.object,
	}

	shouldComponentUpdate (nextProps) {
		const { item: nextItem } = nextProps;
		const { item } = this.props;
		if (item.getID() === nextItem.getID() && item.selectedText === nextItem.selectedText) {
			return false;
		}

		return false;
	}

	render () {
		const { item, context } = this.props;
		let { presentationProperties } = item;
		let colorName = (presentationProperties || {}).highlightColorName;

		let css = cx(
			'application-highlight',
			'plain',
			colorName,
			{ colored: colorName }
		);

		return (
			<div className="stream-highlight">
				<div className="heading">
					<LinkTo.Object object={{ Username: item.creator, isUser: true }} context="stream-profile">
						<DisplayName tag="a" entity={item.creator} />
					</LinkTo.Object> created a highlight on <DateTime date={item.getCreatedTime()} />
				</div>
				<div className="highlight-container">
					<LinkTo.Object object={context} context="stream-context">
						<Presentation.Asset item={context} propName="src" type="thumb">
							<img className="highlight-icon" />
						</Presentation.Asset>
					</LinkTo.Object>
					<div className="highlight-content">
						<Breadcrumb item={item} context={context} />
						<LinkTo.Object object={item} context="stream-highlight">
							<div className="body">
								<Ellipsed tag="span" className={css} measureOverflow="parent" dangerouslySetInnerHTML={{ __html: Ellipsed.trim(item.selectedText, 200, true) }} />
							</div>
						</LinkTo.Object>
					</div>
				</div>
			</div>
		);
	}
}

export default Highlight;
