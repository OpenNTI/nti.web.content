import Url from 'url';
import Path from 'path';


import React from 'react';
import PropTypes from 'prop-types';
import {WindowMessageListener as MESSAGES} from '@nti/lib-dom';
import Logger from '@nti/util-logger';
import QueryString from 'query-string';

const logger = Logger.get('content:widgets:EmbededWidget');

function isSameOrigin (uri, as) {
	const toOrigin = (o) => (
		o = Url.parse(o),
		Object.assign(o, {pathname: '', search: '', hash: ''}),
		o.format()
	);

	return as && (toOrigin(uri) === toOrigin(as));
}


async function resolveSplash (splash, contentPackage) {
	if (!splash || !contentPackage || Path.isAbsolute(splash)) { return splash; }

	try {
		const resolved = await contentPackage.resolveContentURL(splash);

		return resolved;
	} catch (e) {
		return null;
	}
}


async function resolvePath (parts, contentPackage) {
	if (Path.isAbsolute(parts.pathname)) { return parts.format(); }

	try {
		const resolved = await contentPackage.resolveContentURL(parts.pathname);

		parts.pathname = resolved;

		return parts.format();
	} catch (e) {
		return parts.format();
	}
}


function getSize (width, height, maxWidth) {
	if (!width || !maxWidth || width <= maxWidth) {
		return {width: width || '100%', height};
	}

	const aspect = height ? (width / height) : (16 / 9);

	return {
		width: maxWidth,
		height: maxWidth / aspect
	};
}


function parseData (message) {
	try {
		return JSON.parse(message.data) || {};
	} catch (e) {
		return {};
	}
}

const OTHER_ATTRS_BLACK_LIST = ['itemprop', 'dataset', 'class', 'type', 'guid'];
const NO_SOURCE_ID = 'No source id specified!';
const ALLOW_FULLSCREEN = {'allowFullScreen': true};
const SANDBOX = {
	sandbox: [
		'allow-forms',
		'allow-modals',
		'allow-orientation-lock',
		'allow-pointer-lock',
		'allow-popups',
		'allow-popups-to-escape-sandbox',
		'allow-presentation',
		'allow-scripts'
	].join(' ')
};


export default class EmbeddedWidget extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		contentPackage: PropTypes.object,
		maxWidth: PropTypes.number,
		onHeightChange: PropTypes.func
	}

	state = {source: null, width: null, height: null}


	getIdKey () {
		return (this.props.item && this.props.item['uid-name']) || 'id';
	}

	componentDidMount () {
		MESSAGES.add(this.onMessage);
		this.setup();
	}


	componentWillUnmount () {
		MESSAGES.remove(this.onMessage);
	}


	componentDidUpdate (prevProps) {
		const {item, contentPackage} = this.props;
		const {item:oldItem, contentPackage: oldPackage} = prevProps;

		if (item !== oldItem || contentPackage !== oldPackage) {
			this.setup();
		}
	}


	async setup (props = this.props) {
		const {contentPackage, item = {}, maxWidth} = this.props;
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

		const parts = Url.parse(source);
		const q = QueryString.parse(parts.search);

		const sourceName = uid || q[idKey] || NO_SOURCE_ID;

		if (q[idKey] !== sourceName) {
			q[idKey] = encodeURIComponent(sourceName);
			parts.search = QueryString.stringify(q);
		}

		const splashURL = await resolveSplash(splash, contentPackage);
		const path = await resolvePath(parts, contentPackage);
		const size = getSize(width, height, maxWidth);
		const sameOrigin = isSameOrigin(path, (global.location || {}).origin);

		for (let key of OTHER_ATTRS_BLACK_LIST) {
			delete otherAttrs[key];
		}


		this.setState({
			sourceName,
			source: path,
			sameOrigin,
			size,
			splash: splashURL,
			defer,
			allowfullscreen: Boolean(allowfullscreen),
			nosandboxing: Boolean(nosandboxing),
			otherAttrs
		}, () => this.onHeightChange());
	}


	onMessage = (e) => {
		const data = parseData(e);
		const id = data[this.getIdKey()];
		const {method, value} = data;
		const {sourceName} = this.state;

		if (sourceName === NO_SOURCE_ID || sourceName !== id) {
			logger.debug(`Ignoring Event: ${sourceName} != ${id}, %o`, e.data);
			return;
		}

		if (method === 'resize') {
			this.setState({
				height: parseInt(value, 10)
			}, () => this.onHeightChange());
		}
	}


	onHeightChange () {
		const {onHeightChange} = this.props;
		const {size} = this.state;

		if (onHeightChange) {
			onHeightChange(size.height);
		}
	}


	onSplashClicked = (e) => {
		e.preventDefault();
		e.stopPropagation();

		this.setState({splash: null});
	}


	render () {
		const {source, size} = this.state;

		if (!source) { return null; }

		return (
			<div className="nti-embedded-widget" style={{height: size.height || 0}}>
				{this.renderSplash()}
				{this.renderIframe()}
			</div>
		);
	}


	renderSplash () {
		const {splash} = this.state;

		if (!splash) { return null; }

		return (
			<div
				className="splash"
				onClick={this.onSplashClicked}
				style={{backgroundImage: `url(${splash})`}}
			/>
		);
	}


	renderIframe () {
		const {
			splash,
			defer,
			source,
			sameOrigin,
			size,
			allowfullscreen,
			nosandbox,
			otherAttrs
		} = this.state;

		if (splash && defer !== false) { return null; }

		const sandboxProps = sameOrigin && !nosandbox ? SANDBOX : {};
		const allowfullscreenProps = allowfullscreen ? ALLOW_FULLSCREEN : {};

		return (
			<iframe
				src={source}
				frameBorder="no"
				scrolling="no"
				seamless
				{...size}
				{...sandboxProps}
				{...allowfullscreenProps}
				{...(otherAttrs || {})}
			/>
		);
	}
}
