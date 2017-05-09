import {setBlockData, removeBlock} from './utils';

export default {
	create: (config = {}) => {
		const {customRenderers = [], customStyles = [], blockProps} = config;

		let extraProps = blockProps || {};

		return {
			setExtraProps: (props = {}) => {
				extraProps = props;
			},

			mergeExtraProps: (props = {}) => {
				extraProps = {...extraProps, ...props};
			},

			blockRendererFn: (contentBlock, pluginProps) => {
				const {getEditorState, setEditorState} = pluginProps;

				for (let renderer of customRenderers) {
					if (renderer.handlesBlock(contentBlock)) {
						return {
							component: renderer.component,
							editable: renderer.editable,
							props: {
								...(renderer.props || {}),
								...(pluginProps || {}),
								...(extraProps || {}),
								setBlockData: (data) => {
									const newState = setBlockData(contentBlock, data, getEditorState());

									setEditorState(newState);
								},
								removeBlock: () => {
									const newState = removeBlock(contentBlock, getEditorState());

									setEditorState(newState);
								}
							}
						};
					}
				}
			},

			blockStyleFn: (contentBlock) => {
				for (let style of customStyles) {
					if (style.handlesBlock(contentBlock)) {
						return style.className;
					}
				}
			}
		};
	}
};
