import {setBlockData} from './utils';

export default {
	create: (config = {}) => {
		const {customRenderers = [], customStyles = []} = config;

		return {
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
								setBlockData: (data) => {
									const newState = setBlockData(contentBlock, data, getEditorState());

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