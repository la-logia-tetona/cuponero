const { DateTime } = require('luxon');

const supportedDateFormats = [
	'd-L-y',
	'd-L-yy',
	'd/L/y',
	'd/L/yy',
];

function isDate(value) {
	if (value !== null) {
		for (const format of supportedDateFormats) {
			if (DateTime.fromFormat(value, format).isValid) {
				return true;
			}
		}
	}
	return false;
}

function formatDate(value) {
	if (value !== null) {
		let date;
		for (const format of supportedDateFormats) {
			date = DateTime.fromFormat(value, format);
			if (date.isValid) {
				return date;
			}
		}
	}
	return null;
}

exports.isDate = isDate;
exports.formatDate = formatDate;