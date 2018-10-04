import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	prompt: 'Write something...'
};

const t = scoped('web-content.stream.ThoughtPrompt', DEFAULT_TEXT);

export default function ThoughtPrompt ({ onClick }) {
	return (
		<div className="new-thought" onClick={onClick}>
			<div className="prompt">{t('prompt')}</div>
		</div>
	);
}

ThoughtPrompt.propTypes = {
	onClick: PropTypes.func
};
