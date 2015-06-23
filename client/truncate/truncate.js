angular.module('truncate', [])
.filter('truncate', function() {
	return function(input, num) {
		if (isNaN(num)) return input;
		if (input <= 0) return '';
		
		var fullWord = input;
		
		if (input && input.length > num) {
			input = input.substring(0, num);
			
			while(input.charAt(input.length -1) === ' ') {
				input = input.substr(0, input.length -1);
			}
			
			return input + '...';
		}
		return input;
	};
});