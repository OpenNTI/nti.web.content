import './View.scss';
import PropTypes from 'prop-types';
import React from 'react';

import { StickyElement, StickyContainer } from '@nti/web-commons';

import { ContentOptionSwitcher } from '../../common';
import NavBar from '../nav-bar';

import Content from './Content';
import Options from './Options';
import RenderingMask from './RenderingMask';

EditorPanel.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object,
	pageSource: PropTypes.object,
	breadcrumb: PropTypes.array,
	gotoResources: PropTypes.func,
	readOnly: PropTypes.bool,
};
export default function EditorPanel({
	contentPackage,
	course,
	pageSource,
	gotoResources,
	breadcrumb,
	readOnly,
}) {
	const optionsCmp = (
		<Options
			contentPackage={contentPackage}
			course={course}
			readOnly={readOnly}
		/>
	);
	const contentCmp = (
		<Content
			contentPackage={contentPackage}
			course={course}
			readOnly={readOnly}
		/>
	);

	return (
		<StickyContainer className="content-editor-panel">
			<StickyElement>
				<NavBar
					pageSource={pageSource}
					gotoResources={gotoResources}
					breadcrumb={breadcrumb}
				/>
			</StickyElement>
			<ContentOptionSwitcher
				options={optionsCmp}
				content={contentCmp}
				hideOptions
			/>
			<RenderingMask contentPackage={contentPackage} />
		</StickyContainer>
	);
}
