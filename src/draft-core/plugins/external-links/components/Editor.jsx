import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	url: 'url'
};

const t = scoped('DRAFT_CORE_EXTERNAL_LINK_EDITOR', DEFAULT_TEXT);

const stop = e => (e.preventDefault(), e.stopPropagation());

export default class ExternalLinkEditor extends React.Component {
	static propTypes = {
		data: React.PropTypes.object,
		onChange: React.PropTypes.func,
		onSave: React.PropTypes.func
	}


	constructor (props) {
		super(props);

		const {data} = props;
		const {url} = data || {};

		this.state = {
			url
		};
	}


	onURLChange = () => {}


	render () {
		const {url} = this.state;

		return (
			<div className="draft-core-external-link-editor">
				<label htmlFor="external-url">{t('url')}</label>
				<input name="external-url" type="text" value={url} onChange={this.onURLChange} onFocus={stop} />
			</div>
		);
	}
}
