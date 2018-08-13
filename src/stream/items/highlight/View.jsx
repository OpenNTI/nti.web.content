import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DateTime, DisplayName, Ellipsed } from '@nti/web-commons';

import Registry from '../Registry';
import Breadcrumb from '../../breadcrumb';

@Registry.register('application/vnd.nextthought.highlight')
class Highlight extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			presentationProperties: PropTypes.shape({
				highlightColorName: PropTypes.string
			}),
			creator: PropTypes.string,
			selectedText: PropTypes.string
		}),
		context: PropTypes.object
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
				<Breadcrumb item={item} context={context} />
				<div className="heading">
					<DisplayName entity={item.creator} /> created a highlight on <DateTime date={item.date} />
				</div>
				{/* <Breadcrumb item={item} /> */}
				<div className="body">
					<Ellipsed tag="span" className={css} measureOverflow="parent" dangerouslySetInnerHTML={{ __html: Ellipsed.trim(item.selectedText, 200, true) }} />
				</div>
			</div>
		);
	}
}

export default Highlight;
