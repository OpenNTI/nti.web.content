import React from 'react';
import PropTypes from 'prop-types';
import { parent } from '@nti/lib-dom';

const ATTRIBUTE = 'data-anchor';
const SELECTOR = `[${ATTRIBUTE}]`;

export default class Anchor extends React.Component {
	static getAllAnchors(content) {
		return Array.from(content.querySelectorAll(SELECTOR));
	}

	static getAnchorAround(node) {
		if (node.matches(SELECTOR)) {
			return node;
		}

		return parent(node, SELECTOR);
	}

	static isAnchor(node) {
		return node && node.dataset.anchor;
	}

	static getAnchorInfo(node) {
		if (!Anchor.isAnchor(node)) {
			return null;
		}

		return {
			id: node.dataset.anchorId,
		};
	}

	static propTypes = {
		id: PropTypes.string,
	};

	render() {
		const { id, ...otherProps } = this.props;
		const annotateProps = {
			'data-anchor': true,
		};

		if (id) {
			annotateProps['data-anchor-id'] = id;
		}

		return <a {...otherProps} {...annotateProps} />;
	}
}
