import Emphasis from '../Emphasis';
import {getInputInterface} from '../../../../Parser';

fdescribe('Emphasis', () => {
	describe('isNextBlock', () => {
		it('Opens a Range if there isn\'t an active range', () => {
			const chars = ['*', 'e', 'm', 'p', 'h', 'a', 's', 'i', 's', '*'];
			const inputInterface = getInputInterface(0, chars);

			expect(Emphasis.isNextBlock(inputInterface, {})).toBeTruthy();
		});

		it('Does not open a range if the following character is not valid', () => {
			const chars = ['*', ' ', 'n', 'o', 't'];
			const inputInterface = getInputInterface(0, chars);

			expect(Emphasis.isNextBlock(inputInterface, {})).toBeFalsy();
		});

		it('Does not open a range if another range is open', () => {
			const chars = ['*', 'e', 'm', 'p'];
			const inputInterface = getInputInterface(0, chars);

			expect(Emphasis.isNextBlock(inputInterface, {openRange:'strong-emphasis'})).toBeFalsy();
		});

		it('Closes a Range if the active range is emphasis', () => {
			const chars = ['*', ' ', 'n', 'o', 't', ' ', 'e', 'm', 'p'];
			const inputInterface = getInputInterface(0, chars);

			expect(Emphasis.isNextBlock(inputInterface, {openRange: Emphasis.rangeName})).toBeTruthy();
		});
	});

	describe('Parse', () => {
		it('Opening Range consumes 2 characters and opens a range', () => {
			const chars = ['*', 'e', 'm', 'p'];
			const inputInterface = getInputInterface(0, chars);
			const {block, context, length} = Emphasis.parse(inputInterface, {});

			expect(context.openRange).toEqual(Emphasis.rangeName);
			expect(block.text).toEqual('e');
			expect(length).toEqual(2);
		});

		it('Closing Range consumes 1 character and closes the range', () => {
			const chars = ['*', ' ', 'n', 'o', 't'];
			const inputInterface = getInputInterface(0, chars);
			const {block, length} = Emphasis.parse(inputInterface, {openRange: Emphasis.rangeName});

			//The open range is cleared out when this block is appended
			// expect(context.openRange).toBeFalsy();
			expect(block.text).toEqual('');
			expect(length).toEqual(1);
		});
	});
});
