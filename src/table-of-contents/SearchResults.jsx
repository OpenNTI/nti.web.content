import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {rawContent} from '@nti/lib-commons';
import {Layouts} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import styles from './SearchResults.css';

const cx = classnames.bind(styles);

const bin = (arr, field) => arr.reduce((acc, item) => {
	acc[item[field]] = [...acc[item[field]] || [], item];
	return acc;
}, {});

export default class SearchResults extends React.Component {

	render () {
		const {hits, onLoadMore} = this.props;
		return !hits || !hits.length ? null : (
			<div className="toc-search-results">
				<Layouts.InfiniteScroll.Continuous loadMore={onLoadMore} buffer={100}>
					{hits.map((hit, i) => (
						<Hit key={hit.NTIID} hit={hit} />
					))}
				</Layouts.InfiniteScroll.Continuous>
			</div>
		);
	}
}

SearchResults.propTypes = {
	hits: PropTypes.array,
	onLoadMore: PropTypes.func
};

const Hit = ({hit}) => {
	const {ContainerTitle: containerTitle, Fragments: fragments, TargetMimeType: targetMimeType} = hit;
	const {title, content = [], keywords} = bin(fragments, 'Field');
	return (
		<LinkTo.Object object={hit} className={cx('search-hit')} data-target-mimetype={targetMimeType}>
			<div className={cx('hit-title')}>
				{title
					? <Fragment fragment={title[0]} />
					: containerTitle
				}
			</div>
			<Fragments fragments={content} className={cx('content-hits')}/>
			<Fragments fragments={keywords} className={cx('keyword-hits')} tag="div" />
		</LinkTo.Object>
	);
};

Hit.propTypes = {
	hit: PropTypes.shape({
		ContainerTitle: PropTypes.string,
		Fragments: PropTypes.array,
		TargetMimeType: PropTypes.string,
	})
};

const Fragments = ({fragments, className, ...other}) => (
	!fragments || !fragments.length ? null : (
		<div className={cx('hit-fragments', className)}>
			{ fragments.map((f, i) => <Fragment key={i} fragment={f} {...other} />)}
		</div>
	)
);

Fragments.propTypes = {
	fragments: PropTypes.array
};

const Fragment = ({fragment: {Matches: matches}, tag: Tag = 'p'}) => (
	matches.map((m, i) => <Tag key={i} className={cx('fragment')} {...rawContent(m)} />)
);
