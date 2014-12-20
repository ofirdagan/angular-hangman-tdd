'use strict';

(function () {

  /* @ngInject */
  function keyboard(hangmanEvents) {
    return {
      templateUrl: 'views/keyboard.view.html',
      restrict: 'E',
      scope: {
        keys: '=',
        wasSelected: '&'
      },
      link: function postLink(scope) {
        scope.onKeyClick = function (key) {
          scope.$emit(hangmanEvents.letterSelected, key);
        };
      }
    };
  }

  angular
    .module('hangmanAppInternal')
    .directive('keyboard', keyboard);
})();
