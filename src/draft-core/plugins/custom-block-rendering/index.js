export default {
	create: (config = {}) => {
		const {customRenderers = []} = config;

		return {
			blockRendererFn: (contentBlock, pluginProps) => {
				for (let renderer of customRenderers) {
					if (renderer.handlesBlock(contentBlock)) {
						return {
							component: renderer.component,
							editable: renderer.editable,
							props: {
								...(renderer.props || {}),
								...(pluginProps || {})
							}
						};
					}
				}
			}
		};
	}
};
