import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {rawContent} from '@nti/lib-commons';
import {Layouts} from '@nti/web-commons';

import styles from './SearchResults.css';

const cx = classnames.bind(styles);

export default class SearchResults extends React.Component {

	render () {
		const {hits, onLoadMore} = this.props;
		return !hits || !hits.length ? null : (
			<div className="toc-search-results">
				<Layouts.InfiniteScroll.Continuous loadMore={onLoadMore} buffer={100}>
					{hits.map(({NTIID: id, ContainerTitle: title, Fragments: fragments, TargetMimeType: targetMimeType}, i) => (
						<div key={id || i} className={cx('search-hit')} data-target-mimetype={targetMimeType}>
							<div className={cx('hit-title')}>{title}</div>
							<div className={cx('hit-fragments')}>
								{fragments.map((f, idx) => <Fragment key={idx} fragment={f} />)}
							</div>
						</div>
					))}
				</Layouts.InfiniteScroll.Continuous>
			</div>
		);
	}
}

const Fragment = ({fragment: {Matches: matches}}) => (
	matches.map((m, i) => <span key={i} {...rawContent(m)} />)
);