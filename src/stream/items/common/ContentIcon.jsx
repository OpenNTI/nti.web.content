import React from 'react';
import PropTypes from 'prop-types';
import { Array as ArrayUtils } from '@nti/lib-commons';
import { getService } from '@nti/web-client';

const { ensure: ensureArray } = ArrayUtils;
const getID = (x) => x && x.getID && x.getID();

async function getThumbnail (item) {
	// walk up from the deep end of the path looking for an icon
	const getIcon = x => {
		const p = ensureArray(x).slice();
		let part, result;
		while (!result && (part = p.pop())) {
			result = (part.getPresentationProperties && part.getPresentationProperties().thumb) || part.icon;
		}
		return result;
	};

	try {
		const path = await item.getContextPath();
		return getIcon(path[0]);
	} catch (e) {
		if (e && e.statusCode === 403 && e.Items) {
			try {
				const service = await getService();
				const path = await service.getObject(e.Items);
				return getIcon(path[0]);
			} catch (error) {
				return Promise.reject(error);
			}

		} else {
			//Really, the only error this should be is item is falsy, or item does not have a getContextPath method.
			return Promise.reject(null);
		}
	}
}


export default class extends React.Component {
	static displayName = 'ContentIcon';

	static propTypes = {
		item: PropTypes.shape({
			getContextPath: PropTypes.func
		})
	};

	state = {};

	componentDidMount () {
		this.load();
	}

	componentDidUpdate (prevProps, prevState) {
		const { item } = this.props;
		const { item: prevItem } = prevProps;
		if (getID(item) !== getID(prevItem)) {
			this.load(this.props);
		}
	}

	load = async (props = this.props) => {
		let { item } = props;
		if (item) {
			try {
				const src = await getThumbnail(item);
				this.setState({ src });
			} catch (error) {
				this.setState({ src: null });
			}
		} else {
			this.setState({ src: null });
		}
	};

	render () {
		let { src } = this.state;

		return !src ? null : (
			<img src={src} />
		);
	}
}
