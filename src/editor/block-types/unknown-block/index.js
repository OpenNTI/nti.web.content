import { BLOCKS } from '@nti/web-editor';

import Block from './Block';

export const handlesBlock = block => block.getType() === BLOCKS.ATOMIC;
export const className = 'nti-unknown-atomic-block-container';
export const component = Block;
