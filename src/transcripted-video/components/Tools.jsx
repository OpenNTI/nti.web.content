import { scoped } from '@nti/lib-locale';
import { Text } from '@nti/web-commons';
import { Button, Icons } from '@nti/web-core';
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
				data-testid="media-viewer"
			>
				<Icons.MediaViewer />
				<Labels.Base localeKey="mediaViewer" />
			</LinkTo.Object>
			<WatchedSegments.Trigger />
		</ControlBar>
	);
}
