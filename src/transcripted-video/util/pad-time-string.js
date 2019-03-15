// ensure the first segment of a duration string is at least two digits: 5:31 => 05:31
export default s => s.indexOf(':') === 1 ? '0' + s : s;
