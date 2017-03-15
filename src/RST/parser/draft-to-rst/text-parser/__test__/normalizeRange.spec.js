import normalizeRanges from '../normalizeRanges';

function buildRange (offset, length, style, key) {
	return {
		offset,
		length,
		style,
		key
	};
}

describe('normalizeRange', () => {
	//TODO: add more tests of the individual components
	it('No Overlap in Ranges', () => {
		const testRanges = [
			buildRange(0, 5, 'bold'),
			buildRange(6, 5, 'italic'),
			buildRange(12, 5, 'underline')
		];

		const normalized = normalizeRanges(testRanges);

		expect(normalized.length).toEqual(3);

		expect(normalized[0].offset).toEqual(0);
		expect(normalized[0].length).toEqual(5);
		expect(normalized[0].styles.length).toEqual(1);
		expect(normalized[0].styles[0]).toEqual('bold');

		expect(normalized[1].offset).toEqual(6);
		expect(normalized[1].length).toEqual(5);
		expect(normalized[1].styles.length).toEqual(1);
		expect(normalized[1].styles[0]).toEqual('italic');


		expect(normalized[2].offset).toEqual(12);
		expect(normalized[2].length).toEqual(5);
		expect(normalized[2].styles.length).toEqual(1);
		expect(normalized[2].styles[0]).toEqual('underline');
	});

	it('Two Ranges Overlap', () => {
		const testRanges = [
			buildRange(0, 10, 'bold'),
			buildRange(5, 10, 'italic')
		];

		const normalized = normalizeRanges(testRanges);

		expect(normalized.length).toEqual(3);

		expect(normalized[0].offset).toEqual(0);
		expect(normalized[0].length).toEqual(5);
		expect(normalized[0].styles.length).toEqual(1);
		expect(normalized[0].styles).toEqual(jasmine.arrayContaining(['bold']));


		expect(normalized[1].offset).toEqual(5);
		expect(normalized[1].length).toEqual(5);
		expect(normalized[1].styles.length).toEqual(2);
		expect(normalized[1].styles).toEqual(jasmine.arrayContaining(['bold', 'italic']));


		expect(normalized[2].offset).toEqual(10);
		expect(normalized[2].length).toEqual(5);
		expect(normalized[2].styles.length).toEqual(1);
		expect(normalized[2].styles).toEqual(jasmine.arrayContaining(['italic']));
	});

	it('Two Ranges Overlap with same end', () => {
		const testRanges = [
			buildRange(0, 15, 'bold'),
			buildRange(5, 10, 'underline'),
			buildRange(10, 5, 'italic')
		];

		const normalized = normalizeRanges(testRanges);

		expect(normalized.length).toEqual(3);

		expect(normalized[0].offset).toEqual(0);
		expect(normalized[0].length).toEqual(5);
		expect(normalized[0].styles.length).toEqual(1);
		expect(normalized[0].styles).toEqual(jasmine.arrayContaining(['bold']));

		expect(normalized[1].offset).toEqual(5);
		expect(normalized[1].length).toEqual(5);
		expect(normalized[1].styles.length).toEqual(2);
		expect(normalized[1].styles).toEqual(jasmine.arrayContaining(['bold', 'underline']));

		expect(normalized[2].offset).toEqual(10);
		expect(normalized[2].length).toEqual(5);
		expect(normalized[2].styles.length).toEqual(3);
		expect(normalized[2].styles).toEqual(jasmine.arrayContaining(['bold', 'underline', 'italic']));
	});
});
