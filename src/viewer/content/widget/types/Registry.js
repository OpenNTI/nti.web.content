import {Registry, String as StringUtils} from '@nti/lib-commons';

const KEYS_TO_CHECK = ['MimeType', 'Class', 'type', 'class'];//TODO: fix content-processing to normalize 'class' to 'Class'

function toRegExpStr (s) {
	return StringUtils.escapeForRegExp(s.replace(/^application\/vnd\.nextthought\./, ''));
}

export default class ContentWidgetRegistry extends Registry.Handler {
	static buildHandler (re) {
		let matcher = re;

		if (Array.isArray(matcher)) {
			matcher = matcher.map(toRegExpStr);
			matcher = new RegExp(`(${matcher.join('|')})`, 'i');
		} else if (typeof matcher === 'string') {
			matcher = new RegExp(toRegExpStr(matcher), 'i');
		}

		return (item) => {
			const keys = Object.keys(item);

			return KEYS_TO_CHECK
				.filter(key => keys.includes(key))
				.map(key => item[key])
				.some(value => matcher.test(value));
		};
	}
}
