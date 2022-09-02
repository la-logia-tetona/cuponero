function isNumber(value) {
	return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

exports.isNumber = isNumber;