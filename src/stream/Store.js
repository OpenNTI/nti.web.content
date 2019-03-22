import { Stream } from '@nti/web-commons';

const BATCH_AFTER = {
	ANYTIME: null,
	PAST_WEEK: 'pastweek',
	PAST_MONTH: 'pastmonth',
	PAST_THREE_MONTHS: 'pastthreemonths',
	PAST_SIX_MONTHS: 'pastsixmonths',
	PAST_YEAR: 'pastyear'
};

const HIGHLIGHTS = 'application/vnd.nextthought.highlight';
const NOTES = 'application/vnd.nextthought.note';
const BOOKMARKS = 'Bookmarks';
const LIKES = 'Like';

export default class StreamStore {
	constructor (context, params = {}) {

		this.loadDataSource = context.getStreamDataSource();
		this.cache = {};

		const { types } = params;
		let accepts = [];
		let filters = [];

		if (types.NOTES) {
			accepts.push(NOTES);
		}

		if (types.HIGHLIGHTS) {
			accepts.push(HIGHLIGHTS);
		}

		if (types.BOOKMARKS) {
			filters.push(BOOKMARKS);
		}

		if (types.LIKES) {
			filters.push(LIKES);
		}

		this.params = {
			batchSize: 20,
			batchAfter: Stream.getDate(params.batchAfter || BATCH_AFTER.ANYTIME),
			sortOn: params.sortOn,
			sortOrder: params.sortOrder,
			accept: accepts.join(','),
			...(filters.length > 0 && { filter: filters.join(','), filterOperator: 'union' }),
		};
	}

	async getTotalCount () {
		const dataSource = await this.loadDataSource;

		const hasFilters = (this.params.filter && this.params.filter.length > 0)
			|| (this.params.accept && this.params.accept !== '');

		if(!hasFilters) {
			return 0;
		}

		try {
			const page = await dataSource.loadPage(0, this.params);

			return page.Items.length === 0 ? 0 : page.TotalPageCount;
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
