import React from 'react';
import PropTypes from 'prop-types';
import { isFlag } from '@nti/web-client';

import Registry from '../Registry';
import { ContentIcon } from '../common';

@Registry.register('application/vnd.nextthought.note')
class Note extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired
	}

	render () {
		const { item } = this.props;
		return (
			<div className="stream-note">
				<div className={`activity ${item.isReply() ? 'reply' : 'detail'}`}>
					{item.isReply() ? null : (
						<div className="ugd note heading">
							<ContentIcon item={item} />
							{/* {isFlag('disable-context-in-activity') !== true && (
								<Context item={item} className="activity"/>
							)} */}
						</div>
					)}
					{/* <Detail item={item} lite/>
					{!item.isReply() && (<RecentReplies item={item} count={1} />)} */}
				</div>
			</div>
		);
	}
}

export default Note;
