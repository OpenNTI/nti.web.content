import React from 'react';
import renderer from 'react-test-renderer';
import { TestUtils } from '@nti/web-client';

import Highlight from '../View';

const { tearDownTestClient, setupTestClient } = TestUtils;

const mockService = {
	resolveEntity: () => Promise.resolve({ displayName: 'Tim Jones' }),
};

const onBefore = () => {
	jest.useFakeTimers();
	setupTestClient(mockService);
};

const onAfter = () => {
	tearDownTestClient();
};

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

function createNodeMock (element) {
	if (element.type === 'span') {
		return {
			textContext: 'Wide-body aircraft, such as the B-767, B-777, and A-340, have two, three, or four jet engines and may carry over 64,000 gallons (256 000 L) of jet fuel (Figures 3.2a). Wide-body aircraft cabins...',
			setAttribute: () => {},
			querySelector: () => null,
			parentNode: {
				scrollHeight: 0,
				clientHeight: 0,
				offsetHeight: 41
			}
		};
	}
	return null;
}

/* eslint-env jest */
describe('Stream: Highlight', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('General Snapshot', async () => {
		const item = {
			'creator': 'josh.birdwell@nextthought.com',
			'CreatedTime': 1539193071.268633,
			getCreatedTime: function () {
				return new Date(this.CreatedTime);
			},
			getContextPath: function () {
				return Promise.resolve([
					[
						{ NTIID: 'tag:nextthought.com,2011-10:IFSTA-Bundle-IFSTA_Book_Aircraft_Rescue_and_Fire_Fighting_Sixth_Edition', getPresentationProperties: function () { return { author: 'IFSTA', title: 'Aircraft Rescue and Fire Fighting Sixth Edition', label: undefined }; }},
						{ NTIID: 'tag:nextthought.com,2011-10:IFSTA-HTML-IFSTA_Book_Aircraft_Rescue_and_Fire_Fighting_Sixth_Edition.section:Types_of_Aircraft3', Title: 'Types of Aircraft' }
					]
				]);
			},
			'NTIID': 'tag:nextthought.com,2011-10:josh.birdwell@nextthought.com-OID-0x05a7b0:5573657273:kUvXvKw8HbW',
			'applicableRange': {
				'MimeType': 'application/vnd.nextthought.contentrange.domcontentrangedescription',
				'Class': 'DomContentRangeDescription',
				'ancestor': {
					'MimeType': 'application/vnd.nextthought.contentrange.elementdomcontentpointer',
					'Class': 'ElementDomContentPointer',
					'role': 'ancestor',
					'elementTagName': 'P',
					'elementId': 'cb6ffcc62c56c2c4f39b119a9fdd28a8'
				},
				'end': {
					'MimeType': 'application/vnd.nextthought.contentrange.textdomcontentpointer',
					'Class': 'TextDomContentPointer',
					'role': 'end',
					'ancestor': {
						'MimeType': 'application/vnd.nextthought.contentrange.elementdomcontentpointer',
						'Class': 'ElementDomContentPointer',
						'role': 'ancestor',
						'elementTagName': 'P',
						'elementId': 'cb6ffcc62c56c2c4f39b119a9fdd28a8'
					},
					'contexts': [
						{
							'MimeType': 'application/vnd.nextthought.contentrange.textcontext',
							'contextOffset': 121,
							'contextText': 'passengers '
						},
						{
							'MimeType': 'application/vnd.nextthought.contentrange.textcontext',
							'contextOffset': 0,
							'contextText': '('
						},
						{
							'MimeType': 'application/vnd.nextthought.contentrange.textcontext',
							'contextOffset': 0,
							'contextText': 'Figures'
						},
						{
							'MimeType': 'application/vnd.nextthought.contentrange.textcontext',
							'contextOffset': 0,
							'contextText': ')'
						},
						{
							'MimeType': 'application/vnd.nextthought.contentrange.textcontext',
							'contextOffset': 0,
							'contextText': '.'
						}
					],
					'edgeOffset': 10
				},
				'start': {
					'MimeType': 'application/vnd.nextthought.contentrange.textdomcontentpointer',
					'Class': 'TextDomContentPointer',
					'role': 'start',
					'ancestor': {
						'MimeType': 'application/vnd.nextthought.contentrange.elementdomcontentpointer',
						'Class': 'ElementDomContentPointer',
						'role': 'ancestor',
						'elementTagName': 'P',
						'elementId': 'cb6ffcc62c56c2c4f39b119a9fdd28a8'
					},
					'contexts': [
						{
							'MimeType': 'application/vnd.nextthought.contentrange.textcontext',
							'contextOffset': 152,
							'contextText': 'Wide-body'
						}
					],
					'edgeOffset': 0
				},
				'isDomContentRangeDescription': true
			},
			'presentationProperties': {
				'highlightColorName': 'blue'
			},
			selectedText: 'Wide-body aircraft, such as the B-767, B-777, and A-340, have two, three, or four jet engines and may carry over 64,000 gallons (256 000 L) of jet fuel (Figures 3.2a). Wide-body aircraft cabins have dual aisles creating a center section of seats, allowing the aircraft to carry over 500 passengers'
		};
		const context = {
			NTIID: 'tag:nextthought.com,2011-10:IFSTA-Bundle-IFSTA_Book_Aircraft_Rescue_and_Fire_Fighting_Sixth_Edition',
			PlatformPresentationResources: [{
				'Class': 'DisplayablePlatformPresentationResources',
				'CreatedTime': 1532453102,
				'InheritPlatformName': null,
				'Last Modified': 1527882586,
				'PlatformName': 'webapp',
				'Version': 1,
				'href': '/content/sites/ifsta.nextthought.com/ContentPackageBundles/Aircraft%20Rescue%20and%20Fire%20Fighting%20Sixth%20Edition/presentation-assets/webapp/v1/'
			}]
		};

		const options = { createNodeMock };
		const highlightCmp = renderer.create(<Highlight item={item} context={context} />, options);

		jest.runAllTimers();
		await flushPromises();

		const tree = highlightCmp.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
