import Parser from '../../Parser';

import blocks from './blocks';
import {inputTransforms, outputTransforms} from './transforms';

export default new Parser(blocks, inputTransforms, outputTransforms);
