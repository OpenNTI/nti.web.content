import './EmbeddedWidget.scss';
import Path from 'path';

import React from 'react';
import PropTypes from 'prop-types';

import { WindowMessageListener as MESSAGES } from '@nti/lib-dom';
import Logger from '@nti/util-logger';
import { url } from '@nti/lib-commons';

const logger = Logger.get('content:widgets:EmbededWidget');

async function resolveForRoots(path, roots) {
	for (let root of roots) {
		if (!root.resolveContentURL) {
			continue;
		}

		try {
			const resolved = await root.resolveContentURL(path);

			return resolved;
		} catch (e) {
			continue;
		}
	}

	throw new Error('Unable to resolve path for root');
}

async function resolveSplash(splash, contentPackage, page) {
	const roots = [];

	if (page) {
		roots.push(page);
	}
	if (contentPackage) {
		roots.push(contentPackage);
	}

	if (!splash || !roots.length || Path.isAbsolute(splash)) {
		return splash;
	}

	try {
		const resolved = await resolveForRoots(splash, roots);

		return resolved;
	} catch (e) {
		return null;
	}
}

async function resolvePath(url, contentPackage, page) {
	if (Path.isAbsolute(url.pathname)) {
		return url.toString();
	}

	const roots = [];

	if (page) {
		roots.push(page);
	}
	if (contentPackage) {
		roots.push(contentPackage);
	}

	try {
		const resolved = await resolveForRoots(url.pathname, roots);
		const u = new URL(url.toString());
		u.pathname = resolved;
		return u.toString();
	} catch (e) {
		return url.toString();
	}
}

function getSize(width, height, maxWidth) {
	if (!width || !maxWidth || width <= maxWidth) {
		return { width: width || '100%', height };
	}

	const aspect = height ? width / height : 16 / 9;

	return {
		width: maxWidth,
		height: maxWidth / aspect,
	};
}

function parseData(message) {
	try {
		return JSON.parse(message.data) || {};
	} catch (e) {
		return {};
	}
}

const OTHER_ATTRS_BLACK_LIST = ['itemprop', 'dataset', 'class', 'type', 'guid'];
const NO_SOURCE_ID = 'No source id specified!';
const ALLOW_FULLSCREEN = { allow: 'fullscreen', allowFullScreen: true };
const SANDBOX = {
	sandbox: [
		'allow-forms',
		'allow-modals',
		'allow-orientation-lock',
		'allow-pointer-lock',
		'allow-popups',
		'allow-popups-to-escape-sandbox',
		'allow-presentation',
		'allow-scripts',
	].join(' '),
};

export default class EmbeddedWidget extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		contentPackage: PropTypes.object,
		page: PropTypes.object,
		maxWidth: PropTypes.number,
		onHeightChange: PropTypes.func,
	};

	state = { source: null, width: null, height: null };

	getIdKey() {
		return (this.props.item && this.props.item['uid-name']) || 'id';
	}

	componentDidMount() {
		MESSAGES.add(this.onMessage);
		this.setup();
	}

	componentWillUnmount() {
		MESSAGES.remove(this.onMessage);
	}

	componentDidUpdate(prevProps) {
		const { item, contentPackage } = this.props;
		const { item: oldItem, contentPackage: oldPackage } = prevProps;

		if (item !== oldItem || contentPackage !== oldPackage) {
			this.setup();
		}
	}

	async setup(props = this.props) {
		const { contentPackage, page, item = {}, maxWidth } = this.props;
		const idKey = this.getIdKey();
		const {
			defer,
			height,
			width,
			allowfullscreen,
			'no-sandboxing': nosandboxing,
			source,
			uid,
			splash,
			...otherAttrs
		} = item;

		const _url = new URL(source);

		const sourceName = uid || _url.searchParams.get(idKey) || NO_SOURCE_ID;

		if (_url.searchParams.get(idKey) !== sourceName) {
			_url.searchParams.set(idKey, sourceName);
		}

		const splashURL = await resolveSplash(splash, contentPackage, page);
		const path = await resolvePath(_url, contentPackage, page);
		const size = getSize(width, height, maxWidth);
		const sameOrigin = url.isSameOrigin(
			path,
			(global.location || {}).origin
		);

		for (let key of OTHER_ATTRS_BLACK_LIST) {
			delete otherAttrs[key];
		}

		this.setState(
			{
				sourceName,
				source: path,
				sameOrigin,
				size,
				splash: splashURL,
				defer,
				allowfullscreen: Boolean(allowfullscreen),
				nosandboxing: Boolean(nosandboxing),
				otherAttrs,
			},
			() => this.onHeightChange()
		);
	}

	onMessage = e => {
		const data = parseData(e);
		const id = data[this.getIdKey()];
		const { method, value } = data;
		const { sourceName } = this.state;

		if (sourceName === NO_SOURCE_ID || sourceName !== id) {
			logger.debug(`Ignoring Event: ${sourceName} != ${id}, %o`, e.data);
			return;
		}

		if (method === 'resize') {
			this.setState(
				{
					height: parseInt(value, 10),
				},
				() => this.onHeightChange()
			);
		}
	};

	onHeightChange() {
		const { onHeightChange } = this.props;
		const { size, height } = this.state;

		if (onHeightChange) {
			onHeightChange(height || size.height);
		}
	}

	onSplashClicked = e => {
		e.preventDefault();
		e.stopPropagation();

		this.setState({ splash: null });
	};

	getStyleObject(styleString) {
		let style = {};
		let attributes = styleString.split(';');

		for (let i = 0; i < attributes.length; i++) {
			let entry = attributes[i].split(/:(.+)/);
			style[entry.splice(0, 1)[0]] = entry.join('');
		}

		return style;
	}

	render() {
		const { source, size, height } = this.state;

		if (!source) {
			return null;
		}

		return (
			<div
				className="nti-embedded-widget"
				style={{ height: height || size.height || 0 }}
			>
				{this.renderSplash()}
				{this.renderIframe()}
			</div>
		);
	}

	renderSplash() {
		const { splash } = this.state;

		if (!splash) {
			return null;
		}

		return (
			<div
				className="splash"
				onClick={this.onSplashClicked}
				style={{ backgroundImage: `url(${splash})` }}
			/>
		);
	}

	renderIframe() {
		const {
			splash,
			defer,
			source,
			sameOrigin,
			size,
			allowfullscreen,
			nosandbox,
			otherAttrs,
			height,
		} = this.state;

		let frameBorder = 0;
		let style = {};

		if (splash && defer !== false) {
			return null;
		}

		const sizeProps = {
			width: size.width,
			height: height || size.height,
		};
		const sandboxProps = sameOrigin && !nosandbox ? SANDBOX : {};
		const allowfullscreenProps = allowfullscreen ? ALLOW_FULLSCREEN : {};

		if (otherAttrs['style'] && typeof otherAttrs['style'] === 'string') {
			style = this.getStyleObject(otherAttrs['style']);
			delete otherAttrs['style'];
		}

		if (otherAttrs['frameborder']) {
			frameBorder = otherAttrs['frameborder'];
			delete otherAttrs['frameborder'];
		}

		return (
			<iframe
				src={source}
				frameBorder={frameBorder}
				style={style}
				scrolling="no"
				seamless
				{...sizeProps}
				{...sandboxProps}
				{...allowfullscreenProps}
				{...(otherAttrs || {})}
			/>
		);
	}
}
