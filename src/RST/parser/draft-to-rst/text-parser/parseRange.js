import {INLINE_STYLE, ENTITY_TYPE} from 'draft-js-utils';

const DEFAULT = 'default';

const {BOLD, ITALIC, UNDERLINE} = INLINE_STYLE;
const BOLD_ITALIC = getKeyForStyles([BOLD, ITALIC]);
const BOLD_UNDERLINE = getKeyForStyles([BOLD, UNDERLINE]);
const ITALIC_UNDERLINE = getKeyForStyles([ITALIC, UNDERLINE]);
const BOLD_ITALIC_UNDERLINE = getKeyForStyles([BOLD, ITALIC, UNDERLINE]);

const {LINK} = ENTITY_TYPE;

function getKeyForStyles (styles) {
	const contains = styles.reduce((acc, style) => {
		acc[style] = true;

		return acc;
	}, {});

	const bold = contains[BOLD] ? BOLD : '';
	const italic = contains[ITALIC] ? ITALIC : '';
	const underlined = contains[UNDERLINE] ? UNDERLINE : '';

	return bold + italic + underlined;
}

const STYLES_HANDLERS = {
	[DEFAULT]: () => { return {start: '', end: ''}; },
	[BOLD]: () => { return {start: '**', end: '**'}; },
	[ITALIC]: () => { return {start: '*', end: '*'}; },
	[UNDERLINE]: () => { return {start: ':underline:`',	end: '`'}; },
	[BOLD_ITALIC]: () => { return {start: ':bolditalic:`', end: '`'}; },
	[BOLD_UNDERLINE]: () => { return {start: ':boldunderline:`', end: '`'}; },
	[ITALIC_UNDERLINE]: () => { return {start: ':italicunderline:`',	end: '`'}; },
	[BOLD_ITALIC_UNDERLINE]: () => { return {start: ':bolditalicunderline:`', end: '`'}; }
};


const ENTITY_HANDLERS = {
	[DEFAULT]: () => { return {start: '', end: ''}; },
	[LINK]: (entity) => {
		const {data} = entity;
		const {href} = data;

		return {
			start: '`',
			end: ` <${href}>\`_`
		};
	}
};


function parseRangeForKeys (keys, text, context) {
	const key = keys[0];
	const entity = context.entityMap[key];
	const entityHandler = ENTITY_HANDLERS[entity.type] || ENTITY_HANDLERS[DEFAULT];
	const {start, end} = entityHandler(entity);

	return `${start}${text}${end}`;
}


function parseRangeForStyles (styles, text) {
	const key = getKeyForStyles(styles);
	const styleHandler = STYLES_HANDLERS[key] || STYLES_HANDLERS[DEFAULT];
	const {start, end} = styleHandler(styles);

	return `${start}${text}${end}`;
}

const LEADING_WHITESPACE = /^(\s*)/;

function getLeadingLength (text) {
	const matches = text.match(LEADING_WHITESPACE);
	const leading = matches[1];

	return leading.length;
}

const TRAILING_WHITESPACE = /(\s*)$/;

function getTrailingLength (text) {
	const matches = text.match(TRAILING_WHITESPACE);
	const trailing = matches[1];

	return trailing.length;
}



function getTextParts (text) {
	const leadingLength = getLeadingLength(text);
	const trailingLength = getTrailingLength(text);
	const subTextLength = text.length - leadingLength - trailingLength;

	if (leadingLength === text.length) {
		return {
			prefix: text,
			subText: '',
			suffix: ''
		};
	}

	return {
		prefix: text.substr(0, leadingLength),
		subText: text.substr(leadingLength, subTextLength),
		suffix: text.substr(leadingLength + subTextLength, trailingLength)
	};
}


export default function parseRange (range, text, context) {
	const {styles, keys} = range;
	let {prefix, subText, suffix} = getTextParts(text);

	if (!subText) { return prefix + suffix; }

	//For now let styles override the keys
	if (keys && keys.length) {
		subText = parseRangeForKeys(keys, subText, context);
	} else if (styles && styles.length) {
		subText = parseRangeForStyles(styles, subText, context);
	}

	return prefix + subText + suffix;
}
