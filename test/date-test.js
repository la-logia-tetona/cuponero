const { isDate } = require('../src/utils/date');

console.log('True');
console.log(isDate('22-05-2022'));
console.log(isDate('22/05/2022'));
console.log(isDate('22-05-22'));
console.log(isDate('22/05/22'));
console.log('False');
console.log(isDate('22-13-2020'));
console.log(isDate('32/05/2022'));
console.log(isDate('22-13-20'));
console.log(isDate('32/05/22'));
console.log(isDate('a'));
console.log(isDate(null));