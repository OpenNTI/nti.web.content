export default function (selection, dataTransfer) {
	const insertID = dataTransfer.data.getData('application/vnd.nextthought.app.dndinsertblock');

	if (insertID) {
		return 'handled';
	}

	return 'not-handled';
}
