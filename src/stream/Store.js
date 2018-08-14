import { Stores } from '@nti/lib-store';
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

// const ACCEPT = {
// 	DISCUSSION: [
// 		'application/vnd.nextthought.forums.dflheadlinetopic',
// 		'application/vnd.nextthought.forums.communityheadlinetopic',
// 		'application/vnd.nextthought.forums.generalforumcomment',
// 		'application/vnd.nextthought.forums.communityheadlinetopic'
// 	],
// 	BOOKMARK: 'application/vnd.nextthought.bookmark',
// 	HIGHLIGHT: 'application/vnd.nextthought.highlight',
// 	NOTE: 'application/vnd.nextthought.note',
// 	LIKE: ''
// };



export default class StreamStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.params = {
			batchSize: 20,
			sortOn: SORT_ON.DATE_CREATED,
			batchAfter: Stream.getDate(BATCH_AFTER.ANYTIME),
			accept: []
		};

		this.set('loading', true);
		this.set('error', false);
		this.set('items', []);
		this.set('hasMore', false);
	}

	setBatchAfter (batchAfter) {
		this.params = {
			...this.params,
			batchAfter: Stream.getDate(batchAfter)
		};
		this.reload();
	}

	setSortOn (sortOn) {
		this.params = {
			...this.params,
			sortOn
		};
		this.reload();
	}

	async reload () {
		this.set('loading', true);
		this.set('error', false);
		this.emitChange('loading', 'error', 'forum', 'dataSource');
		try {
			const dataSource = this.get('dataSource');
			const page = await dataSource.loadPage(0, this.params);

			this.set('loading', false);
			this.set('lastPage', 0);
			this.set('items', page.Items);
			this.set('hasMore', page.Items.length >= PAGE_SIZE);
			this.emitChange('loading', 'items', 'hasMore');
		} catch (e) {
			logger.error(e);
			this.set('loading', false);
			this.set('error', true);
			this.set('hasMore', false);
			this.emitChange('loading', 'error', 'hasMore');
		}
	}

	async load (context) {
		const dataSource = await context.getStreamDataSource();

		this.set('context', context);
		this.set('dataSource', dataSource);
		this.set('loading', true);
		this.set('error', false);
		this.emitChange('loading', 'error', 'forum', 'dataSource');

		try {
			const page = await dataSource.loadPage(0, this.params);

			this.set('loading', false);
			this.set('lastPage', 0);
			this.set('items', page.Items);
			this.set('hasMore', page.Items.length >= PAGE_SIZE);
			this.emitChange('loading', 'items', 'hasMore');
		} catch (e) {
			logger.error(e);
			this.set('loading', false);
			this.set('error', true);
			this.set('hasMore', false);
			this.emitChange('loading', 'error', 'hasMore');
		}
	}

	async loadNextPage () {
		const lastPage = this.get('lastPage');
		const dataSource = this.get('dataSource');
		const items = this.get('items');

		this.set('loading', true);
		this.set('error', false);
		this.emitChange('loading', 'error');

		try {
			const page = await dataSource.loadPage(lastPage + 1, this.params);

			this.set('loading', false);
			this.set('lastPage', lastPage + 1);
			this.set('items', [...items, ...page.Items]);
			this.set('hasMore', page.Items.length >= PAGE_SIZE);
			this.emitChange('loading', 'items', 'hasMore');
		} catch (e) {
			this.set('loading', false);
			this.set('error', true);
			this.set('hasMore', false);
			this.emitChange('loading', 'error', 'hasMore');
		}
	}
}
