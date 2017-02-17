import strategy from './strategy';
import Link from './components/Link';

export default (config = {}) => {
	return {
		decorators: [
			{
				strategy,
				component: Link
			}
		]
	};
};
