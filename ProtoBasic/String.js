/* 
 * Extended String functions
 * 
 * Taken from Prototype
 * Except for parseAsColor
 * Copyright (c) 2005-2010 Sam Stephenson
 */
Object.extend(String, {
	interpret: function(value) {
		return ((value == null) ? '' : String(value));
	},
	specialChar: {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'\\': '\\\\'
	}
});

Object.extend(String.prototype, (function() {
	function includes(pattern) {
		return this.indexOf(pattern) > -1;
	}
	
	function startsWith(pattern) {
		return (this.lastIndexOf(pattern, 0) === 0);
	}
	
	function endsWith(pattern) {
		var d = this.length - pattern.length;
		
		return ((d >= 0) && (this.indexOf(pattern, d) === d));
	}
	
	function sub(pattern, replacement, count) {
		var replacementString = replacement.toString();
		replacement = ((Object.isFunction(replacement)) ? replacement : (function(match) { return replacementString; }));
		count = ((Object.isUndefined(count)) ? 1 : count);
		
		return this.gsub(pattern, function(match) {
			if (--count < 0) {
				return match[0];
			}
			
			return replacement(match);
		});
	}
	
	function gsub(pattern, replacement) {
		var result = '';
		var source = this;
		var match = null;
		var replacementString = replacement.toString();
		replacement = ((Object.isFunction(replacement)) ? replacement : (function(match) { return replacementString; }));
		
		if (Object.isString(pattern)) {
			pattern = RegExp.escape(pattern);
		}
		
		if (!(pattern.length || pattern.source)) {
			replacement = replacement('');
			
			return replacement + source.split('').join(replacement) + replacement;
		}
		
		while (source.length > 0) {
			if (match = source.match(pattern)) {
				result += source.slice(0, match.index);
				result += String.interpret(replacement(match));
				source = source.slice(match.index + match[0].length);
			}
			else {
				result += source;
				source = '';
			}
		}
		
		return result;
	}
	
	function trim() {
		return this.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	function trimLeft() {
		return this.replace(/^\s*/, '');
	}
	
	function trimRight() {
		return this.replace(/\s*$/, '');
	}
	
	function parseAsColor() {
		var hexColor = '#';
		
		if (this.trim().indexOf('rgb') === 0) {
			this.match(/(\d){1,3}/g).each(function(number, index) {
				if (index > 2) return null;
				
				hexColor += ((parseInt(number, 10) < 16) ? '0' : '') + parseInt(number, 10).toString(16);
			});
			
			return hexColor;
		}
		else {
			var basic = this.toLowerCase().replace(/[^0-9a-f]/g, '');
			
			if (basic.length === 6) {
				return hexColor+basic;
			}
			else if (basic.length === 3) {
				return hexColor+basic[0]+basic[0]+basic[1]+basic[1]+basic[2]+basic[2];
			}
			else {
				return '';
			}
		}
	}
	
	function inspect(useDoubleQuotes) {
		var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
			if (character in String.specialChar) {
				return String.specialChar[character];
			}
			
			return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
		});
		
		if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
		
		return "'" + escapedString.replace(/'/g, '\\\'') + "'";
	}
	
	return {
		includes:	includes,
		startsWith:	startsWith,
		endsWith:	endsWith,
		sub:		sub,
		gsub:		gsub,
		trim:		String.prototype.trim || trim,
		strip:		String.prototype.trim || trim,
		trimLeft:	String.prototype.trimLeft || trimLeft,
		trimRight:	String.prototype.trimRight || trimRight,
		parseAsColor:	parseAsColor,
		inspect:	inspect
	};
})());
