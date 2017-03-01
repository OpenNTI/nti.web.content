import {INLINE_STYLE, ENTITY_TYPE} from 'draft-js-utils';

const WHITE_SPACE = /\s/;

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
			end: ` <${href}>\``
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


function getTextParts (text) {
	const firstChar = text.charAt(0);
	const lastChar = text.charAt(text.length - 1);
	const startOffset = WHITE_SPACE.test(firstChar) ? 1 : 0;
	const endOffset = WHITE_SPACE.test(lastChar) ? text.length - 1 : text.length;
	const subText = text.substring(startOffset, endOffset);

	return {
		prefix: WHITE_SPACE.test(firstChar) ? firstChar : '',
		subText,
		suffix: WHITE_SPACE.test(lastChar) ? lastChar : ''
	};

}


export default function parseRange (range, text, context) {
	if (!text) { return ''; }

	const {styles, keys} = range;
	let {prefix, subText, suffix} = getTextParts(text);

	//For now let styles override the keys
	if (styles.length) {
		subText = parseRangeForStyles(styles, subText, context);
	} else if (keys.length) {
		subText = parseRangeForKeys(keys, subText, context);
	}

	return prefix + subText + suffix;
}
