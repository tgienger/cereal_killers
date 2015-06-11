angular.module('camelCaseFilter', [])
.filter('camelCase', function() {
	return function(string) {
		// example: 
		// camelCaseWords to Camel Case Words
		// 
		// how:
		// insert a space before each uppercase letter
		string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
		
		// find first character
		var oldFirst = string.charAt(0);
		
		// make an uppercase variant
		var newFirst = string.charAt(0).toUpperCase();
		
		// replace the first character with the uppercase variant
		string = string.replace(RegExp(oldFirst), newFirst);

		return string;
	};
});