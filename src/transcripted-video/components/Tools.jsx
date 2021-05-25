import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Button, Icons, Text, Hooks } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';
import { Resume, WatchedSegments } from '@nti/web-video/controls';

const t = scoped('nti-content.transcripted-video.components.Tools', {
	mediaViewer: 'Media Viewer',
	watchHistory: 'Watch History',
});

const ToolBar = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: 1rem;

	& > *:not(:first-of-type) {
		margin-left: 1rem;
	}
`;

const WatchedContainer = styled('div')`
	margin-top: 1rem;
	padding: 1.125rem 1.25rem 0.875rem;
	background: #f5f6f8;
`;

const LinkButton = styled(Button).attrs({ inverted: true, rounded: true })``;

const Labels = Text.Translator(t);

export default function VideoTools({ video }) {
	const [showWatched, setShowWatched] = React.useState(false);
	const toggleShowWatched = React.useCallback(
		() => setShowWatched(!showWatched),
		[showWatched, setShowWatched]
	);

	const watchedId = Hooks.useId('watchedsegments');

	return (
		<>
			<ToolBar>
				<Resume inverted rounded />
				<LinkTo.Object
					as={LinkButton}
					object={video}
					context={{ mediaViewer: true }}
				>
					<Icons.MediaViewer />
					<Labels.Base localeKey="mediaViewer" />
					{/* <Text.Base>{t('mediaViewer')}</Text.Base> */}
				</LinkTo.Object>
				<Button
					rounded
					inverted
					onClick={toggleShowWatched}
					aria-expanded={showWatched}
					aria-controls={watchedId}
				>
					<Text.Base>{t('watchHistory')}</Text.Base>
					<Icons.Chevron.Down />
				</Button>
			</ToolBar>
			{showWatched && (
				<WatchedContainer id={watchedId}>
					<WatchedSegments />
				</WatchedContainer>
			)}
		</>
	);
}

VideoTools.propTypes = {
	video: PropTypes.object,
};
