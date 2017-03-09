import React from 'react';
import {StickyElement, StickyContainer} from 'nti-web-commons';

import {ContentOptionSwitcher} from '../../common';
import NavBar from '../nav-bar';

import Content from './Content';
import Options from './Options';
import RenderingMask from './RenderingMask';


EditorPanel.propTypes = {
	contentPackage: React.PropTypes.object,
	course: React.PropTypes.object,
	pageSource: React.PropTypes.object
};
export default function EditorPanel ({contentPackage, course, pageSource}) {
	const optionsCmp = (<Options contentPackage={contentPackage} course={course} />);
	const contentCmp = (<Content contentPackage={contentPackage} course={course} />);

	return (
		<StickyContainer className="content-editor-panel">
			<StickyElement>
				<NavBar pageSource={pageSource} />
			</StickyElement>
			<ContentOptionSwitcher options={optionsCmp} content={contentCmp} hideOptions />
			<RenderingMask contentPackage={contentPackage} />
		</StickyContainer>
	);
}
