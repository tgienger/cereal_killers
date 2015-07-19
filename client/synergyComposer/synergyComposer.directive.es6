

function SynergyComposerDirective($timeout) {
    return {
        templateUrl: 'client/synergyComposer/synergyComposer.ng.html',
        restrict: 'EA',
        controllerAs: 'composer',
        controller: 'SynergyComposerController',
        transclude: true,
        scope: { composer: '=', save: '&' },
        link: (scope, element, attrs, composer) => {
            scope.composer = composer;
            var mods = composer.mods;




            var apply = function() {
                scope.$evalAsync(function() {
                    composer.setMarkdown();
                });
            };



            /**
             * Watch for the value of composer.collapse, if it's set to false
             * then put the composer into focus.
             * @param  {Boolean} val New value of composer.collapse
             */
            scope.$watch('composer.collapse', function(val) {
                if (val === false) {

                  $('.composer_container').css({
                    bottom: '0px',
                  });


                  if (composer.post.subject === '') {
                    $timeout(function() {
                      angular.element('#composer_subject').focus();
                    }, 800);
                  } else {
                    $timeout(function() {
                      angular.element('#synergy-composer').focus();
                    }, 800);
                  }

                } else {
                  $('.composer_container').css({
                    bottom: '-100%',
                  });
                }
            });



            /**
             * Handles toolbar selection. Gets id of clicked toolbar icon,
             * selected text if any, and replaces it or places new text
             * where caret is located.
             * @param {event} event Click event
             */
            function toolbarHandler(event) {
                switch (event.target.id) {
                case 'toolbar-bold':
                    composer.create(mods.get('bold'), function() {
                        apply();
                    });
                    return;
                case 'toolbar-italic':
                    composer.create(mods.get('italic'), function() {
                        apply();
                    });
                    return;
                case 'toolbar-code':
                    composer.create(mods.get('code'), function() {
                        apply();
                    });
                    break;
                case 'toolbar-link':
                    composer.create(mods.get('link'), function() {
                        apply();
                    });
                    break;
                case 'toolbar-quote':
                    composer.create(mods.get('quote'), function() {
                        apply();
                    });
                    break;
                case 'toolbar-ul':
                    composer.create(mods.get('ul'), function() {
                        apply();
                    });
                    break;
                case 'toolbar-ol':
                    composer.create(mods.get('ol'), function() {
                        apply();
                    });
                    break;
                }

            }



            // Added click event handlers to each part of the toolbar.
            angular.element('#toolbar-bold').on('click', toolbarHandler);
            angular.element('#toolbar-italic').on('click', toolbarHandler);
            angular.element('#toolbar-code').on('click', toolbarHandler);
            angular.element('#toolbar-link').on('click', toolbarHandler);
            angular.element('#toolbar-quote').on('click', toolbarHandler);
            angular.element('#toolbar-ul').on('click', toolbarHandler);
            angular.element('#toolbar-ol').on('click', toolbarHandler);


        }
    }
}

SynergyComposerDirective.$inject = ['$timeout'];
angular.module('synergy.composer').directive('synergyComposer', SynergyComposerDirective);
