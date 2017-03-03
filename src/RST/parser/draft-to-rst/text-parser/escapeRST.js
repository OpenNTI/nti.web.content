const RST_REGEX = /([\!,",#,\$,%,&,',\(,\),\*,\+,\,,\-,\.,\/,\:,;,\<,\=,>,\?,@,\[,\\,\],\^,_,`,\{,\|,\}.\~])/g;

export default function (text) {
	return text.replace(RST_REGEX, '\$1');
}
