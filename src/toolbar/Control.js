import React from 'react';
import cx from 'classnames';

import { LinkTo } from '@nti/web-routing';

const Control = ({ cxt, obj, className, allPages }) => {
	const controlClassName = cx(className, {
		disabled: !obj,
		'real-page': allPages,
	});

	if (obj) {
		return (
			<LinkTo.Object context={cxt} object={obj}>
				<div className={controlClassName} />
			</LinkTo.Object>
		);
	} else {
		return <div className={controlClassName} />;
	}
};

export default Control;
