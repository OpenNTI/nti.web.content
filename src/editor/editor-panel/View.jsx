import React from 'react';
import {StickyElement, StickyContainer} from 'nti-web-commons';

import {ContentOptionSwitcher} from '../../common';
import NavBar from '../nav-bar';

import Content from './Content';
import Options from './Options';


EditorPanel.propTypes = {
	content: React.PropTypes.object,
	course: React.PropTypes.object,
	pageSource: React.PropTypes.object
};
export default function EditorPanel ({content, course, pageSource}) {
	const optionsCmp = (<Options content={content} course={course} />);
	const contentCmp = (<Content content={content} course={course} />);

	return (
		<StickyContainer className="content-editor-panel">
				<StickyElement>
					<NavBar pageSource={pageSource} />
				</StickyElement>
				<ContentOptionSwitcher options={optionsCmp} content={contentCmp} />
			</StickyContainer>
	);
}
