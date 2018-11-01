import cx from 'classnames';
import Logger from '@nti/util-logger';
import * as Anchors from '@nti/lib-anchors';
import * as RangeUtils from '@nti/lib-ranges';
import {mixin} from '@nti/lib-commons';

import Registry from './Registry';
import Annotation, {RENDERED} from './Annotation';
import RangeWrapperMixin from './RangeWrapperMixin';

const logger = Logger.get('content:components:annotations:Highlight');
const RANGE = Symbol('cached range');

@Registry.register((item) => {
	return /highlight$/i.test(item.MimeType);
})
class Highlight extends Annotation {
	static createFrom (data, color) {

		const base = {
			MimeType: 'application/vnd.nextthought.highlight',
			style: 'plain',
			presentationProperties: {
				highlightColorName: color
			}
		};

		return {
			...base,
			...data
		};
	}


	constructor (...args) {
		super(...args);

		mixin(this, RangeWrapperMixin);

		this.setupDomClassNames();
	}


	setupDomClassNames () {
		let {highlightColorName} = this.getRecordField('presentationProperties') || {};
		let style = this.getRecordField('style') || 'plain';

		this.highlightCls = cx('application-highlight', highlightColorName, style, {
			'shared-with-me': !this.isModifiable,
			'colored': highlightColorName
		});

		Object.assign(this, {
			highlightColorName
		});
	}


	createNonAnchorableSpan () {
		let span = super.createNonAnchorableSpan();
		span.setAttribute('class', this.highlightCls);
		return span;
	}


	updateColor (newColor) {
		let rec = this.getRecord();
		let p = rec.presentationProperties;

		p = p ? Object.create(p) : {};

		p.highlightColorName = newColor;

		return rec.save({presentationProperties: p})
			.then(() => {
				this.setupDomClassNames();
				for (let el of this[RENDERED]) {
					try {
						el.setAttribute('class', this.highlightCls);
					}
					catch(e) { logger.warn(e); }
				}
			});
	}


	remove () {
		let nodes = this[RENDERED];
		let rec = this.getRecord();
		return rec.delete()
			.then(() => {
				delete this[RENDERED];
				for (let el of nodes) {
					this.unwrap(el);
				}
			});
	}


	buildRange () {
		let doc = this.getDocument();
		let range = doc && doc.createRange();

		let elements = this[RENDERED];

		if (elements && elements.length > 0) {
			let a = elements[0];
			let b = elements[elements.length - 1];

			try {
				range.setStartBefore(a);
				range.setEndAfter(b);
			}
			catch (e) {
				logger.error('Error building range: %o', e.stack || e.message || e);
			}
		}

		return range;
	}


	hadValidRange () {
		let {reader} = this;
		let range = this[RANGE];
		let contentNode = reader.getContentNode();

		return range && !RangeUtils.isValidRange(range, contentNode);
	}


	getRange () {
		let {reader} = this;
		let range = this[RANGE];
		let hadRange = !!range;
		let contentNode = reader.getContentNode();

		if (RangeUtils.isValidRange(range, contentNode)) {
			return range;
		}

		else if (range) {
			range = this.buildRange();
			if (!RangeUtils.isValidRange(range, contentNode)) {
				range = null;
			}
		}

		if (!range) {
			range = Anchors.toDomRange(
				this.getRecordField('applicableRange'),
				contentNode,
				reader.getContentNodeClean(),
				this.getRecordField('ContainerId'),
				reader.getPageID()
			);
		}

		if (!range) {
			if (!hadRange) {
				logger.error('bad range', this.getRecord().toJSON());
			}

			return null;
		}

		//logger.log(this.id,': ',(this.getRecordField('body')||[]).join('|'), ': got range from description:', range, range.toString());
		Anchors.expandRangeToIncludeImmutableBlocks(range);

		this[RANGE] = range;
		return range;
	}


	shouldRender () {
		let n = this.reader.getContentNode();
		let elements = this[RENDERED];
		if (n && (!elements || elements.some(e => !n.contains(e)))) {
			delete this[RENDERED];
			if (elements) {
				delete this[RANGE];
			}
			return true;
		}
	}


	render () {
		if (!this.shouldRender()) { return; }

		const r = this.getRange();
		if (!r) {
			return;
		}

		const rec = this.getRecord();
		const rendered = this[RENDERED] = this.wrapRange(r.commonAncestorContainer, r);
		if (rendered && rendered.length > 0) {
			rendered[0].setAttribute('name', rec.getID());
		}
		return true;
	}
}

export {
	Highlight as default
};
