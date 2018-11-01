import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@nti/web-commons';

// import Panel from 'content/components/discussions/Panel';

export default class RecentReplies extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			getRecentReplies: PropTypes.func
		}),
		count: PropTypes.number
	};

	state = {
		loading: false
	}

	componentDidMount () {
		this.load();
	}

	load = (props = this.props) => {

		const { item, count } = props;

		if (!item || !item.getRecentReplies) {
			return;
		}

		this.setState({
			loading: true
		});

		item.getRecentReplies(count)
			.then(replies => this.setState({
				replies,
				loading: false
			}));
	};

	render () {
		const { loading } = this.state;

		if (loading) {
			return <Loading.Ellipse />;
		}

		return (
			<div className="recent-replies">
				{/* {replies.map(r => <Panel item={r} key={r.getID()} lite />)} */}
			</div>
		);
	}
}
