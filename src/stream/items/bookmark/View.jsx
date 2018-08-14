import React from 'react';
import PropTypes from 'prop-types';
import { DateTime, DisplayName, Presentation } from '@nti/web-commons';
import { getService } from '@nti/web-client';

import Registry from '../Registry';
import Breadcrumb from '../../breadcrumb';

@Registry.register('application/vnd.nextthought.bookmark')
class Bookmark extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			creator: PropTypes.string.isRequired,
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
		const service = await getService();
		const page = await service.getObject(props.item.containerId);
		this.setState({
			page
		});
	}

	render () {
		const { item, context } = this.props;
		const { page } = this.state;

		return (
			<div className="stream-bookmark">
				<div className="heading">
					<DisplayName tag="a" entity={item.creator} /> created a bookmark on <DateTime date={item.date} />
				</div>
				<div className="bookmark-content">
					<Presentation.Asset item={context} propName="src" type="thumb">
						<img className="bookmark-icon" />
					</Presentation.Asset>
					<div className="bookmark-context">
						<Breadcrumb context={context} item={item} />
						<div className="page-title">{page && page.Title}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Bookmark;
