export default {
	create: (config = {}) => {
		const {customRenders = []} = config;

		return {
			blockRendererFn: (contentBlock, pluginProps) => {
				for (let render of customRenders) {
					if (render.handlesBlock(contentBlock)) {
						return {
							component: render.component,
							editable: render.component,
							props: {
								...(render.props || {}),
								...(pluginProps || {})
							}
						};
					}
				}
			}
		};
	}
};
