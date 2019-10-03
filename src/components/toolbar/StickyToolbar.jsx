import React from 'react';
import { StickyElement, StickyContainer } from '@nti/web-commons';

import Toolbar from './Toolbar';

export default function StickyToolbar (props) {
	return (
		<StickyContainer>
			<StickyElement>
				<Toolbar {...props} />
			</StickyElement>
		</StickyContainer>
	);
}
