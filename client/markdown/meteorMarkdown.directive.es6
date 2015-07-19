
function MeteorMarkdown() {
    return {
        restrict: 'AE',
        template: '<div id="markdown-preview">' +
                    '<meteor-include src="meteorMdTemplate"></meteor-include>' +
                  '</div>',
        scope: {markdown: '='},
        link: (scope, elem, attrs) => {
        }
    }
}
angular.module('MeteorMarkdown', [])
.directive('meteorMd', MeteorMarkdown);


Template.meteorMdTemplate.helpers({
	md: function() {
		return Template.currentData().getReactively('markdown');
	}
});
