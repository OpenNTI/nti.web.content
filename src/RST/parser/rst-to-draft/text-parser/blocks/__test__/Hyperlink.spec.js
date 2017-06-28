/* globals spyOn */
/* eslint-env jest */
import Hyperlink from '../Hyperlink';
import {getInterface} from '../../../../Parser';

describe('Hyperlink', () => {
	describe('isNextBlock', () => {
		test('Is next block if valid char, no current block, and valid range end', () => {
			const test = ['_', 'l', 'i', 'n', 'k'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, []);

			expect(Hyperlink.isNextBlock(inputInterface, {}, parsedInterface)).toBeTruthy();
		});

		test('Is next bock if valid char, plaintext current block, and valid range end', () => {
			const test = ['_', 'l', 'i', 'n', 'k'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(1, [{isPlaintext: true}]);

			expect(Hyperlink.isNextBlock(inputInterface, {}, parsedInterface)).toBeTruthy();
		});

		test('Is next block if valid char, interpreted current block, and valid range end', () => {
			const test = ['_', '`', 'l', 'i', 't', 'e', 'r', 'a', 'l', '`'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [{isInterpreted: true}]);

			expect(Hyperlink.isNextBlock(inputInterface, {}, parsedInterface)).toBeTruthy();
		});

		test('Is not next block if not valid char', () => {
			const test = ['n', 'o', 't', ' ', 'l', 'i', 'n', 'k'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, []);

			expect(Hyperlink.isNextBlock(inputInterface, {}, parsedInterface)).toBeFalsy();
		});

		test('Is not next block if valid char and not valid current block', () => {
			const test = ['_', 'l', 'i', 'n', 'k'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [{notValid: true}]);

			expect(Hyperlink.isNextBlock(inputInterface, {}, parsedInterface)).toBeFalsy();
		});

		test('Is not next block if not a valid range end', () => {
			const test = [' ', '_'];
			const inputInterface = getInterface(1, test);
			const parsedInterface = getInterface(0, []);

			expect(Hyperlink.isNextBlock(inputInterface, {}, parsedInterface)).toBeFalsy();
		});
	});

	describe('parse', () => {
		function buildBlock (type) {
			const block = {
				[type]: true,
				setRoleMarker: () => {}
			};

			spyOn(block, 'setRoleMarker');

			return block;
		}

		test('Calls setRoleMarker if block is plaintext', () => {
			const test = ['_'];
			const currentBlock = buildBlock('isPlaintext');
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [currentBlock]);
			const {block} = Hyperlink.parse(inputInterface, {}, parsedInterface);

			expect(currentBlock.setRoleMarker).toHaveBeenCalledWith(block);
			expect(block.markerFor).toEqual(currentBlock);
		});

		test('Calls setRoleMarker if block is interpreted', () => {
			const test = ['_'];
			const currentBlock = buildBlock('isInterpreted');
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [currentBlock]);
			const {block} = Hyperlink.parse(inputInterface, {}, parsedInterface);

			expect(currentBlock.setRoleMarker).toHaveBeenCalledWith(block);
			expect(block.markerFor).toEqual(currentBlock);
		});

		test('Consumes following _', () => {
			const test = ['_', '_'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, []);
			const {length} = Hyperlink.parse(inputInterface, {}, parsedInterface);

			expect(length).toEqual(2);
		});
	});

	test('Mutability', () => {
		const block = new Hyperlink();

		expect(block.mutability).toEqual('MUTABLE');
	});

	describe('Output', () => {
		test('returns null if marker is a valid range', () => {
			const block = new Hyperlink();

			block.setMarkerFor({isValidRange: true});

			expect(block.getOutput()).toBeFalsy();
		});

		test('returns null is marker is not a valid range or plain text', () => {
			const block = new Hyperlink();

			block.setMarkerFor({isPlaintext: true});

			expect(block.getOutput()).toBeFalsy();
		});

		test('No marker returns plain text output', () => {
			const block = new Hyperlink();
			const output = block.getOutput({charCount: 0});

			expect(output.output).toEqual('_');
			expect(output.context.charCount).toEqual(1);
		});
	});
});
