import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, DisplayName, Presentation } from '@nti/web-commons';
import { getService } from '@nti/web-client';
import { LinkTo } from '@nti/web-routing';
import Logger from '@nti/util-logger';

import Registry from '../Registry';
import Breadcrumb from '../../breadcrumb';

const logger = Logger.get('content:stream:items:Bookmark');

@Registry.register('application/vnd.nextthought.bookmark')
class Bookmark extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			creator: PropTypes.string.isRequired,
			getCreatedTime: PropTypes.func.isRequired,
			NTIID: PropTypes.string.isRequired
		}).isRequired,
		context: PropTypes.object.isRequired
	}

	state = {
		page: null
	}

	componentDidMount () {
		this.loadPage(this.props);
	}

	componentDidUpdate (prevProps) {
		if (prevProps.item.NTIID !== this.props.item.NTIID) {
			this.loadPage(this.props);
		}
	}

	loadPage = async (props = this.props) => {
		try {
			const service = await getService();
			const page = await service.getObject(props.item.ContainerId);
			this.setState({ page });
		} catch (error) {
			logger.error(error);
		}
	}

	render () {
		const { item, context } = this.props;
		const { page } = this.state;

		return (
			<div className="stream-bookmark">
				<div className="heading">
					<LinkTo.Object object={{ Username: item.creator, isUser: true }} context="stream-profile">
						<DisplayName tag="a" entity={item.creator} />
					</LinkTo.Object> created a bookmark on <DateTime date={item.getCreatedTime()} />
				</div>
				<LinkTo.Object object={item} context="stream-bookmark">
					<div className="bookmark-content">
						<div className="bookmark-charms">
							<div className="bookmark-favorite" />
						</div>
						<Presentation.Asset item={context} propName="src" type="thumb">
							<img className="bookmark-icon" />
						</Presentation.Asset>
						<div className="bookmark-context">
							<Breadcrumb context={context} item={item} />
							<div className="page-title">{page && page.Title}</div>
						</div>
					</div>
				</LinkTo.Object>
			</div>
		);
	}
}

export default Bookmark;
