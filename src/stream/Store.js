import Logger from '@nti/util-logger';
import { Stream } from '@nti/web-commons';

const PAGE_SIZE = 10;

const logger = Logger.get('lib:stream-Store');

/**
 *
 */

const SORT_ON = {
	DATE_CREATED: 'CreatedTime',
	LAST_MODIFIED: 'LastModified',
	MOST_COMMENTED: 'ReferencedByCount',
	MOST_LIKED: 'RecursiveLikeCount'
};

const BATCH_AFTER = {
	ANYTIME: null,
	PAST_WEEK: 'pastweek',
	PAST_MONTH: 'pastmonth',
	PAST_THREE_MONTHS: 'pastthreemonths',
	PAST_SIX_MONTHS: 'pastsixmonths',
	PAST_YEAR: 'pastyear'
};

const EXCLUDE = {
	BOOKMARKS: 'application/vnd.nextthought.bookmark',
	HIGHLIGHTS: 'application/vnd.nextthought.highlight',
	NOTES: 'application/vnd.nextthought.note',
	LIKES: ''
};

const FILTERS = ['BOOKMARKS','LIKES'];

const FILTER_MAP = {
	'BOOKMARKS': 'Bookmarks',
	'LIKES': 'Favorite'
};

export default class StreamStore {
	constructor (context, params = {}) {

		this.loadDataSource = context.getStreamDataSource();
		this.cache = {};

		const filters = (params.exclude || []).filter(x => FILTERS.includes(x)).map(x => FILTER_MAP[x]).join(',');

		this.params = {
			batchSize: 20,
			sortOn: SORT_ON.DATE_CREATED,
			...params,
			batchAfter: Stream.getDate(params.batchAfter || BATCH_AFTER.ANYTIME),
			exclude: (params.exclude || []).map(x => EXCLUDE[x]).join(','),
			filters
		};

		if (filters.length > 0) {
			this.params.filterOperator = 'union';
		}
	}

	async getTotalCount () {
		const dataSource = await this.loadDataSource;
		const page = await dataSource.loadPage(0, this.params);

		return page.TotalPageCount;
	}


	async loadPage (pageNumber) {
		if (this.cache[pageNumber]) {
			return this.cache[pageNumber];
		}

		const dataSource = await this.loadDataSource;
		const page = await dataSource.loadPage(pageNumber - 1, this.params);
		this.cache[pageNumber] = page;
		return page;
	}
}
