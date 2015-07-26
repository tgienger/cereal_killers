

function SynergyComposerDirective($timeout) {
    return {
        templateUrl: 'client/synergyComposer/synergyComposer.ng.html',
        restrict: 'EA',
        controllerAs: 'composer',
        controller: 'SynergyComposerController',
        transclude: true,
        scope: { composer: '=', save: '&save', post: '=' },
        link: (scope, element, attrs, composer) => {
            scope.composer = composer;
            var mods = composer.mods;


            angular.element(document).delegate('#synergy-composer', 'keydown', function (e) {
                var keyCode = e.keyCode || e.which, // keycode send
                    ctrlKey = e.ctrlKey, // control key (modifier)
                    shiftKey = e.shiftKey, // Shift Key (modifier)
                    altKey = e.altKey, // Alt key (modifier)
                    metaKey = e.metaKey, // CMD (OSX) Window Key (Windows)
                    caret;


                /**
                 * Keybind Object constructor
                 *
                 * Returns a keyBinds Object:
                 * @param {Object} keyBind.name The name of the keybind
                 *                              Object. Can be anything,
                 *                              it's for user discription.
                 *
                 * @param {Int} keyBind.name.key The keyCode for the
                 *                               keybind ea. 9 == tab
                 *
                 * @param {Array} keyBind.name.modifiers Array containing
                 *                                       required modifier
                 *                                       keys ea.
                 *                                       ctrlKey == contol key
                 *
                 * @param {Expression} keyBind.name.action Action taken when
                 *                                         the keybinding is
                 *                                         pressed.
                 *                     Example:
                 *                     function() {
                 *                         console.log(keyBind.key + ' was pressed');
                 *                     }
                 */
                var keyBinds = function() {

                    /**
                     * composer.create function. Adds modifier to composer.
                     * @param {string} mod Modifier type ea. '**SAMPLE**' == bold
                     */
                    function compCreate(mod) {
                        composer.create(mod, function() {
                            apply();
                        });
                    }



                    /**
                     * Returned object - see above for description.
                     * modifier object: leave empty for zero modifiers otherwise
                     * 					you must enter all modifiers with either
                     * 					true or false values.
                     */
                    return {
                        // 'tab': {
                        //     key: 9,
                        //     modifiers: {},
                        //     action: tabAction
                        // },
                        'bold': {
                            key: 66,
                            modifiers: {alt:false, ctrl:true, shift:false},
                            action: function() {
                                compCreate(mods.get('bold'));
                            }
                        },
                        'italic': {
                            key: 73,
                            modifiers: {alt:false, ctrl:true, shift:false},
                            action: function() {
                                compCreate(mods.get('italic'));
                            }
                        },
                        // 'addPreviousline': {
                        //     key: 13,
                        //     modifiers: {alt:false, ctrl:true, shift:true},
                        //     action: function() {
                        //         composer.previousLine(function() {
                        //             apply();
                        //         });
                        //     }
                        // },
                        // 'addNewline': {
                        //     key: 13,
                        //     modifiers: {alt:false, ctrl:true, shift:false},
                        //     action: function() {
                        //         composer.advanceToNewLine(function() {
                        //             apply();
                        //         });
                        //     }
                        // },
                        'submitPost': {
                          key: 13,
                          modifiers: {alt:false, ctrl: true, shift: false},
                          action: function() {
                            scope.sendSave();
                          }
                        },
                        'escToClose': {
                            key: 27,
                            modifiers: {},
                            action: function() {
                                composer.close(function() {
                                    apply();
                                });
                            }
                        },
                        'createLink': {
                            key: 76,
                            modifiers: {alt:false, ctrl:true, shift:true},
                            action: function() {
                                compCreate(mods.get('link'));
                            }
                        }
                    };

                };



                /**
                 * Detects the modifiers from the keybind object
                 * @param {Object} keybind Keybinding object;
                 */
                function getKeyBindModifiers(keybind) {
                    var alt = keybind.modifiers.alt;
                    var ctrl = keybind.modifiers.ctrl;
                    var shift = keybind.modifiers.shift;
                    if (altKey === alt && ctrl === (ctrlKey || metaKey) && shift === shiftKey) {
                        return true;
                    }
                    return false;
                }

                function isEmpty(obj) {
                    for (var i in obj) {
                        return false;
                    }
                    return true;
                }

                var keybinds = keyBinds();


                // scours the keybind object for a match to the currently
                // used keys.
                for (var key in keybinds) {
                    var keybind = keybinds[key];
                    if (keybind.hasOwnProperty('key') && keybind.hasOwnProperty('modifiers') && keybind.hasOwnProperty('action')) {
                        if (keybind.key === keyCode) {
                            if (isEmpty(keybind.modifiers)) {
                                e.preventDefault();
                                return keybind.action();
                            }
                            if (getKeyBindModifiers(keybind)) {
                                e.preventDefault();
                                return keybind.action();
                            }
                        }
                    }
                }

            });



            var apply = function() {
                scope.$evalAsync(function() {
                    composer.setMarkdown();
                });
            };


            scope.sendSave = function() {
                if (composer.post && composer.post.markdown !== '') {
                    if (composer.reply_id !== '') {
                        scope.save({post: composer.post});
                    } else {
                        if (composer.subject !== '') {
                            scope.save({post: composer.post});
                        }
                    }
                }
            }


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


                  if (composer.post.subject === '' && composer.post.reply_id === '') {
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
