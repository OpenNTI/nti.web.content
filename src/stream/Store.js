import { Stream } from '@nti/web-commons';

const BATCH_AFTER = {
	ANYTIME: null,
	PAST_WEEK: 'pastweek',
	PAST_MONTH: 'pastmonth',
	PAST_THREE_MONTHS: 'pastthreemonths',
	PAST_SIX_MONTHS: 'pastsixmonths',
	PAST_YEAR: 'pastyear'
};

const acceptsMimeTypeMap = {
	HIGHLIGHTS: 'application/vnd.nextthought.highlight',
	NOTES: 'application/vnd.nextthought.note',
	THOUGHTS: 'application/vnd.nextthought.forums.personalblogentry',
	DISCUSSIONS: 'application/vnd.nextthought.forums.communityheadlinetopic'
};

const filtersMap = {
	BOOKMARKS: 'Bookmarks',
	LIKES: 'Like'
};

export default class StreamStore {
	constructor (context, params = {}) {
		this.loadDataSource = context.getStreamDataSource();
		this.cache = {};

		const { types } = params;
		let accepts = [];
		let filters = [];

		Object.keys(types).forEach(x => {
			if (types[x] && acceptsMimeTypeMap[x]) {
				accepts.push(acceptsMimeTypeMap[x]);
			} else if (types[x] && filtersMap[x]) {
				filters.push(filtersMap[x]);
			}
		});

		this.params = {
			batchSize: 10,
			batchAfter: Stream.getDate(params.batchAfter || BATCH_AFTER.ANYTIME),
			sortOn: params.sortOn,
			sortOrder: params.sortOrder,
			accept: accepts.join(','),
			...(filters.length > 0 && { filter: filters.join(','), filterOperator: 'union' }),
		};
	}

	async getTotalCount () {
		const dataSource = await this.loadDataSource;
		const { filter, accept } = this.params;
		const hasFilters = (filter && filter.length > 0) || (accept && accept !== '');

		if(!hasFilters) { return 0; }

		try {
			const { Items, TotalPageCount } = await dataSource.loadPage(0, this.params);
			return Items.length === 0 ? 0 : TotalPageCount;
		}
		catch (e) {
			return 0;
		}
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
