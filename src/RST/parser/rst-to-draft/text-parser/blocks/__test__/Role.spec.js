import Role from '../Role';
import Plaintext from '../Plaintext';

import {getInterface} from '../../../../Parser';

describe('Role', () => {
	describe('isNextBlock', () => {
		it('matchOpen is true for :', () => {
			const test = [':', 'r', 'o', 'l', 'e'];
			const inputInterface = getInterface(0, test);
			const {matches} = Role.matchOpen(inputInterface);

			expect(matches).toBeTruthy();
		});

		it('matchOpen is false for not :', () => {
			const test = ['r', 'o', 'l', 'e'];
			const inputInterface = getInterface(0, test);
			const {matches} = Role.matchOpen(inputInterface);

			expect(matches).toBeFalsy();
		});

		it('matchClose is true for :', () => {
			const test = [':', 'r', 'o', 'l', 'e'];
			const inputInterface = getInterface(0, test);
			const {matches} = Role.matchClose(inputInterface);

			expect(matches).toBeTruthy();
		});

		it('matchClose is false for not : ', () => {
			const test = ['r', 'o', 'l', 'e'];
			const inputInterface = getInterface(0, test);
			const {matches} = Role.matchClose(inputInterface);

			expect(matches).toBeFalsy();
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

		it('If currentBlock is interpreted role get set as marker', () => {
			const test = [':'];
			const currentBlock = buildBlock('isInterpreted');
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [currentBlock]);
			const {block} = Role.parse(inputInterface, {}, parsedInterface);

			expect(currentBlock.setRoleMarker).toHaveBeenCalledWith(block);
			expect(block.markerFor).toEqual(currentBlock);
		});

		it('If currentBlock is not interpreted role does not get set as marker', () => {
			const test = [':'];
			const currentBlock = buildBlock('notInterpreted');
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [currentBlock]);
			const {block} = Role.parse(inputInterface, {}, parsedInterface);

			expect(currentBlock.setRoleMarker).not.toHaveBeenCalled();
			expect(block.markerFor).toBeFalsy();
		});
	});

	describe('getOutput', () => {
		it('If has marker set, the marker is a valid range, and the role range is closed the output is null', () => {
			const role = new Role();

			role.doClose();
			role.setMarkerFor({isValidRange: true});

			expect(role.getOutput()).toBeNull();
		});

		it('If no marker set output is plain test', () => {
			const role = new Role();

			role.appendBlock(new Plaintext('r'));
			role.appendBlock(new Plaintext('o'));
			role.appendBlock(new Plaintext('l'));
			role.appendBlock(new Plaintext('e'));

			role.appendBlock(new Role());

			const {output, context} = role.getOutput({charCount: 0});

			expect(output).toEqual(':role:');
			expect(context.charCount).toEqual(6);
		});
	});


	describe('getOutputForInterpreted', () => {
		let block;

		beforeEach(() => {
			block = new Plaintext('t');
			block.appendBlock(new Plaintext('e'));
			block.appendBlock(new Plaintext('s'));
			block.appendBlock(new Plaintext('t'));
		});

		//TODO: need to test more of these
		it('emphasis', () => {
			const role = new Role();

			role.appendBlock(new Plaintext('e'));
			role.appendBlock(new Plaintext('m'));
			role.appendBlock(new Plaintext('p'));
			role.appendBlock(new Plaintext('h'));
			role.appendBlock(new Plaintext('a'));
			role.appendBlock(new Plaintext('s'));
			role.appendBlock(new Plaintext('i'));
			role.appendBlock(new Plaintext('s'));

			const {output, context} = role.getOutputForInterpreted(block, {charCount: 0});

			expect(output).toEqual('test');
			expect(context.charCount).toEqual(4);
			expect(context.inlineStyleRanges.length).toEqual(1);
			expect(context.inlineStyleRanges[0].offset).toEqual(0);
			expect(context.inlineStyleRanges[0].length).toEqual(4);
		});
	});
});
