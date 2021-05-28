import React from 'react';

import { scoped } from '@nti/lib-locale';
import { Button, Icons, Text } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { ControlBar, Resume, WatchedSegments } from '@nti/web-video/controls';

const t = scoped('nti-content.transcripted-video.components.Tools', {
	mediaViewer: 'Media Viewer',
});

const LinkButton = styled(Button).attrs({ inverted: true, rounded: true })``;
const Labels = Text.Translator(t);

/**
 * Renders Video Controls
 *
 * @param {{video:object}} props
 * @returns {JSX.Element}
 */
export default function VideoTools({ video }) {
	return (
		<ControlBar>
			<Resume />
			<LinkTo.Object
				as={LinkButton}
				object={video}
				context={{ mediaViewer: true }}
			>
				<Icons.MediaViewer />
				<Labels.Base localeKey="mediaViewer" />
			</LinkTo.Object>
			<WatchedSegments.Trigger />
		</ControlBar>
	);
}
