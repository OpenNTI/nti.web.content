import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';

const DEFAULT_TEXT = {
	prompt: 'Write something...',
	promptWithTitle: 'Write something in %(title) ...'
};

const t = scoped('web-content.stream.ThoughtPrompt', DEFAULT_TEXT);

export default function ThoughtPrompt ({ title }) {
	return (
		<LinkTo.Object context="thought">
			<div className="new-thought">
				<div className="prompt">{title ? t('promptWithTitle', { title }) : t('prompt')}</div>
			</div>
		</LinkTo.Object>
	);
}

ThoughtPrompt.propTypes = {
	title: PropTypes.string
};
