import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {LuckyCharms} from '@nti/web-commons';
import {Panel as Body} from '@nti/web-modeled-content';
import { Context } from '@nti/web-discussions';
import { LinkTo } from '@nti/web-routing';
import { getService } from '@nti/web-client';

import {ItemLinks, Avatar} from '../components';

import Meta from './Meta';

export default class NoteDetils extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			body: PropTypes.any.isRequired,
			isReply: PropTypes.func.isRequired,
			creator: PropTypes.string.isRequired,
			inReplyTo: PropTypes.string,
			getID: PropTypes.func.isRequired,
			title: PropTypes.string
		}).isRequired
	}

	state = {
		reply: null
	}

	componentDidMount () {
		this.resolveReply();
	}

	componentDidUpdate (prevProps) {
		if (prevProps.item.getID() !== this.props.item.getID()) {
			this.resolveReply();
		}
	}

	resolveReply = async () => {
		const { item } = this.props;

		if (!item.isReply()) { return; }

		const service = await getService();
		const reply = await service.getObject(item.inReplyTo);
		this.setState({ reply });
	}

	render () {
		const {item} = this.props;
		const {reply} = this.state;
		const {body, creator, placeholder} = item;
		const isReply = item.isReply();

		return (
			<div className={cx('stream-note-details', {'is-reply': isReply})}>
				<LinkTo.Object object={item} context="stream-context">
					<div className="context">
						<Context item={item} />
					</div>
				</LinkTo.Object>
				<div className="item">
					<LuckyCharms item={item} />
					<div className="title-container">
						<Avatar creator={creator} />
						<Meta item={item} reply={reply} />
					</div>
					{!placeholder && (
						<Body body={body} />
					)}
					<ItemLinks item={item} />
				</div>
			</div>
		);
	}
}
