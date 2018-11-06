import Logger from '@nti/util-logger';
import {safeBoundingBoxForRange, isZeroRect} from '@nti/lib-dom';
import iOSversion from '@nti/util-ios-version';

import Registry from './Registry';
import {NOT_FOUND, HIDDEN, RETRY_AFTER_DOM_SETTLES} from './Annotation';
import Highlight from './Highlight';

const logger = Logger.get('content:components:annotations:Note');

function isBoundingClientRectBroken () {
	let ios = iOSversion();
	return ios && ios[0] < 8;
}

@Registry.register((item) => {
	return /note$/i.test(item.MimeType);
})
class Note extends Highlight {
	static createFrom (data) {

		const base = {
			MimeType: 'application/vnd.nextthought.note',
			style: 'suppressed',
			title: null,
			body: null,
			sharedWith: []
		};

		return {
			...base,
			...data
		};
	}

	constructor (...args) {
		super(...args);
		this.isNote = true;
	}


	shouldRender () {
		if (this.getRecordField('style') !== 'suppressed') {
			return super.shouldRender();
		}
	}


	resolveVerticalLocation () {
		if (this.record.title === 'Test Note') { debugger; }

		let range = this.getRange();
		let rect = safeBoundingBoxForRange(range);
		if (!rect) {
			if (this.hadValidRange()) {
				return RETRY_AFTER_DOM_SETTLES;
			}

			logger.debug('Not Found:', this.getRecord().toJSON(), range);
			return NOT_FOUND;
		}

		let has = !isZeroRect(rect);

		if (!has) {
			let e = range.startContainer;
			if (e) {
				if (!e.getBoundingClientRect) {
					let tempRange = document.createRange();
					tempRange.selectNode(e);
					e = tempRange;
				}
				rect = e.getBoundingClientRect();
			}
			has = !isZeroRect(rect);
		}

		let top = (has && rect.top) || HIDDEN;

		if (has) {
			let node = this.reader.getContentNode();
			top -= node ? node.getBoundingClientRect().top : 0;
		}
		else {
			logger.debug('Hidden:', range, rect);
		}

		if (isBoundingClientRectBroken()) {
			top - document.body.scrollTop;
		}
		return top;
	}
}

export {
	Note as default
};
