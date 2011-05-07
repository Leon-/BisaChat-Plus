/* 
 * Registry
 */
var Registry = {
	data: { },
	
	getValue: function(name) {
		if (typeof this.data[name] == 'undefined') {
			var value = (typeof arguments[1] != 'undefined') ? arguments[1] : undefined;
			
			this.setValue(name, value);
		}
		
		return this.data[name];
	},
	
	setValue: function(name, value) {
		return this.data[name] = value;
	}
};
