import React from 'react';
import PropTypes from 'prop-types';


import StreamItem from './items';

class Page extends React.Component {
	static propTypes ={
		page: PropTypes.shape({
			Items: PropTypes.array
		}),
		context: PropTypes.object,
		loading: PropTypes.bool
	}

	render () {
		const { page, context, loading } = this.props;

		if (!page || loading) {
			return null;
		}

		const items = page && page.Items;
		const filtered = items && items.filter(item => item && StreamItem.canRender(item));
		return (
			<ul className="stream-content">
				{filtered.map(item => {
					return (
						<li key={item.NTIID}>
							<StreamItem key={item.NTIID} item={item} context={context} />
						</li>
					);
				})}
			</ul>
		);
	}
}

export default Page;
