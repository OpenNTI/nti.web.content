import React from 'react';
import { StickyElement, StickyContainer } from '@nti/web-commons';

import Toolbar from './Toolbar';

export default React.forwardRef(function StickyToolbar(props, ref) {
	return (
		<StickyContainer>
			<StickyElement>
				<Toolbar {...props} ref={ref} />
			</StickyElement>
		</StickyContainer>
	);
});
