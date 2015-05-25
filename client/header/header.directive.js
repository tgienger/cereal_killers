angular.module('app').directive('toolbar', function($rootScope) {

  return {
    restrict     : 'E',
    templateUrl  : 'client/header/header.directive.ng.html',
    // scope     : {},
    link         : function (scope, element, attrs) {
      var didScroll  = false,
          options    = [
            {selector: '.bodyContainer', offset: 0, downScrollCallback: shrinkToolbar, upScrollCallback: expandToolbar}
          ],
          isAtTop = true;

      function shrinkToolbar() {
        angular.element('#header').addClass('opened');
      };
      function expandToolbar() {
        angular.element('#header').removeClass('opened');
      };

      $rootScope.$on('$stateChangeStart',
      function() {
        isAtTop = true;
      });


      element.on('mouseover', function() {
        expandToolbar();
      });
      element.on('mouseout', function() {
        if (!isAtTop) {
          shrinkToolbar();
        }
      });


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
});