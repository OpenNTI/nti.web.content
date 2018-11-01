const RECORD = Symbol('record');

export const RENDERED = Symbol('elements');
export const HIDDEN = void 0;
export const NOT_FOUND = -3;
export const RETRY_AFTER_DOM_SETTLES = -4;

export default class Annotations {

	constructor (record, reader) {
		Object.assign(this, {
			[RECORD]: record,
			reader
		});
	}

	get record () {
		return this[RECORD];
	}

	get id () {
		return this.record.getID();
	}

	get isModifiable () {
		return this.record.isModifiable;
	}


	getRecord () {
		return this.record;
	}


	getRange () {
		throw new Error('Subclasses of Annotations must implement getRange');
	}


	getRecordField (field) {
		return this[RECORD][field];
	}


	getDocument () {
		const node = this.reader.getContentNode();

		return node && node.ownerDocument;
	}

	createNonAnchorableSpan () {
		const span = this.getDocument().createElement('span');

		span.setAttribute('data-non-anchorable', 'true');

		return span;
	}


	resolveVerticalLocation () {
		return HIDDEN;
	}

	ownsNode (node) {
		const elements = this[RENDERED];

		return elements && elements.indexOf(node) >= 0;
	}

	shouldRender () {

	}


	render () {

	}

}
