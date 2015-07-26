angular.module('app').directive('toolbar',['$rootScope', '$meteor', '$timeout', function($rootScope, $meteor, $timeout) {

  return {
    restrict     : 'E',
    templateUrl  : 'client/header/header.directive.ng.html',
    scope     : {user: '=', topic: '=', discussion: '='},
    link         : function (scope, element, attrs) {


        scope.showLogin = false;


		toastr.options = {
			tapToDismiss: true
		};

      var didScroll  = false,
          options    = [
            {selector: '.bodyContainer', offset: attrs.offset || 0, downScrollCallback: shrinkToolbar, upScrollCallback: expandToolbar}
          ],
          isAtTop = true;


      scope.currentLocation = {
          header: $rootScope.siteName,
          link: '/home'
      };


      function shrinkToolbar() {
          if (scope.topic) {
              scope.$apply(function() {
                  scope.currentLocation = {
                      header: scope.topic.text,
                      link: 'topic/' + scope.topic.slug
                  }
              });
          }
        // angular.element('#header').addClass('opened');
      };
      function expandToolbar() {
          scope.$apply(function() {
              scope.currentLocation = {
                  header: $rootScope.siteName,
                  link: '/home'
              }
          });
        // angular.element('#header').removeClass('opened');
      };

      scope.displayLoginForm = function() {
          if (scope.showLogin) {
              scope.showLogin = false;
              $('#loginUsername').blur();
              $('#loginPassword').blur();
              $('#loginButton').blur();
          } else {
              scope.showLogin = true;
              $timeout(function() {
                  $('#loginUsername').focus();
              });
          }
      }

      scope.logIn = function() {
          scope.displayLoginForm();
          $meteor.loginWithPassword(scope.login.username, scope.login.password)
          .then(function() {
              toastr.success('logged in as ' + $rootScope.currentUser.username);
          }, function(err) {
              toastr.error(err.message);
          });
        //   $('#loginUsername').blur();
        //   $('#loginPassword').blur();
        //   $('#loginButton').blur();
        //   scope.showlogin = false;
      };

      scope.logOut = function() {
          scope.showLogin = false;
          $meteor.logout().then(function() {
              toastr.success('you logged out');
          }, function(err) {
              toastr.error(err);
          });
      };



      $rootScope.$on('$stateChangeStart',
      function() {
        isAtTop = true;
      });


  //		check if user is admin
  		scope.userIsAdmin = function() {
  			if (!$rootScope.currentUser) {
  				return false;
  			}
  			var userId = $rootScope.currentUser._id;
  			return Roles.userIsInRole(userId, ['admin']);
  		};

      //
    //   element.on('mouseover', function() {
    //     expandToolbar();
    //   });
    //   element.on('mouseout', function() {
    //     if (!isAtTop) {
    //       shrinkToolbar();
    //     }
    //   });


      window.addEventListener('scroll', function() {
        didScroll = true;

        var timer = setInterval(function() {
          clearInterval(timer);
          if(didScroll) {
              didScroll = false;

              var windowScroll = window.pageYOffset;// + window.innerHeight;

              var i = -1,
                  length = options.length;

              while (++i < length) {

                var value        = options[i],
                    selector     = value.selector,
                    offset       = value.offset,
                    downcallback = value.downScrollCallback,
                    upcallback   = value.upScrollCallback;

                var currentElement = document.querySelector(selector);
                if (currentElement !== null) {
                  var elementOffset = currentElement.getBoundingClientRect().top + document.body.scrollTop;

                  if (windowScroll > (elementOffset + offset)) {
                    if (value.done != true) {
                      isAtTop = false;
                      downcallback();
                      value.done = true;
                    }
                  } else if (windowScroll < (elementOffset + offset) && value.done) {
                    isAtTop = true;
                    upcallback();
                    value.done = false;
                  }
                }
              }
          }
        }, 100);
      });

    },
  };
}]);
