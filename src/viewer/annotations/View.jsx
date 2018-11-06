import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {Connectors} from '@nti/lib-store';
import {preresolveLocatorInfo} from '@nti/lib-anchors';

import {getType} from './types';
import Gutter from './Gutter';

const logger = Logger.get('content:components:viewer-parts:annotations');
const INITIAL_STATE = () => ({annotations: {}});

function preresolveLocators (store, node, prestine, pageId) {
	if (!node || !prestine) { return; }

	const descriptions = [];
	const containers = [];

	for (let i of store) {
		const {applicableRange} = i;

		if (applicableRange) {
			descriptions.push(applicableRange);
			containers.push(i.ContainerId);
		}
	}

	preresolveLocatorInfo(
		descriptions,
		node,
		prestine,
		containers,
		pageId
	);
}


function getStoreFrom ({pageDescriptor}) {
	return pageDescriptor && pageDescriptor.getUserDataStore();
}

export default
@Connectors.Any.connect(['pageDescriptor', 'contentBody', 'prestineContentBody'])
class NTIContentViewerAnnotations extends React.Component {
	static propTypes = {
		pageId: PropTypes.string,
		children: PropTypes.node,

		pageDescriptor: PropTypes.object,
		contentBody: PropTypes.object,
		prestineContentBody: PropTypes.object
	}

	state = INITIAL_STATE()


	getPageID () {
		return this.props.pageId;
	}


	getStore () {
		const {pageDescriptor} = this.props;

		return pageDescriptor && pageDescriptor.getUserDataStore();
	}


	getContentNode () {
		return this.props.contentBody;
	}


	getContentNodeClean () {
		return this.props.prestineContentBody;
	}


	componentDidMount () {
		const store = getStoreFrom(this.props);

		this.setupStore(store);
	}


	componentDidUpdate (prevProps) {
		const {contentBody} = this.props;
		const {contentBody: prevContentBody} = prevProps;
		const currentStore = getStoreFrom(this.props);
		const prevStore = getStoreFrom(prevProps);

		if (prevStore && !currentStore) {
			this.setState(INITIAL_STATE());
		} else if (currentStore !== prevStore) {
			this.setState(INITIAL_STATE(), () => {
				this.setupStore(currentStore);
			});
		} else if (contentBody !== prevContentBody) {
			this.renderAnnotations(currentStore);
		}
	}


	setupStore (store) {
		if (!store) { return; }

		if (this.cleanupStoreListener) { this.cleanupStoreListener(); }

		store.addListener('change', this.onUserDataChange);
		this.cleanupStoreListener = () => {
			store.removeListner('change', this.onUserDataChange);
			delete this.cleanupStoreListener;
		};

		this.renderAnnotations(store);
	}


	onUserDataChange = (store) => {
		this.renderAnnotations(store);
	}


	renderAnnotations (store) {
		const {contentBody, prestineContentBody, pageId} = this.props;

		if (!store || !contentBody) { return; }

		preresolveLocators(store, contentBody, prestineContentBody, pageId);

		const {annotations: previousAnnotations = {}} = this.state;
		const annotations = {};
		const deadIDs = new Set(Object.keys(previousAnnotations));

		let newObjects = 0;
		let skipped = 0;
		let rendered = 0;

		for (let item of store) {
			const {applicableRange} = item;

			if (!applicableRange) { continue; }

			const id = item.getID();
			const existing = previousAnnotations[id];
			const Type = getType(item);

			deadIDs.delete(id);

			if ((existing && !existing.shouldRender()) || !Type) {
				skipped += 1;
				continue;
			} else if (!existing) {
				const annotation = new Type(item, this);
				annotations[id] = annotation;

				newObjects += 1;

				if (annotation.render()) {
					rendered += 1;
				}
			}
		}

		logger.debug('Render Complete: rendered - %s, new - %s, skipped - %s, removed - %s', rendered, newObjects, skipped, deadIDs.size);

		if (rendered > 0 || deadIDs.size > 0 || newObjects > 0) {
			this.setState({annotations});
		}

	}


	render () {
		const {children} = this.props;
		const {annotations} = this.state;

		return (
			<div className="nti-content-with-annotations-container">
				<div className="annotated-content">
					{children}
					<Gutter annotations={annotations} />
				</div>
			</div>
		);
	}
}

