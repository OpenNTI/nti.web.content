import './View.scss';
import PropTypes from 'prop-types';

import { Associations } from '@nti/web-commons';

import Icon from './Icon';
import Title from './Title';
import Description from './Description';

const { Sharing } = Associations;

MetaEditor.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object,
	readOnly: PropTypes.bool,
};
export default function MetaEditor({ contentPackage, course, readOnly }) {
	return (
		<div className="content-meta-editor">
			<Icon
				contentPackage={contentPackage}
				course={course}
				readOnly={readOnly}
			/>

			<div className="wrap">
				{contentPackage && (
					<Sharing.Lessons item={contentPackage} scope={course} />
				)}
				<Title
					contentPackage={contentPackage}
					course={course}
					readOnly={readOnly}
				/>
				<Description
					contentPackage={contentPackage}
					course={course}
					readOnly={readOnly}
				/>
			</div>
		</div>
	);
}
