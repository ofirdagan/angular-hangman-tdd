'use strict';

(function () {

  /* @ngInject */
  function letter() {
    return {
      templateUrl: 'views/letter.preload.html',
      restrict: 'E',
      scope: {
        value: '@'
      },
      link: function postLink(scope) {
        scope.isWhiteSpace = !scope.value || scope.value === ' ';
        scope.isRevealed = scope.isWhiteSpace;
        scope.$on('revealLetter', function (args, letter) {
          scope.isRevealed = scope.isRevealed || letter.toLowerCase() === scope.value.toLowerCase();
        });
        scope.$on('resetGame', function () {
          scope.isRevealed = false;
        });
      }
    };
  }

  angular
    .module('hangmanAppInternal')
    .directive('letter', letter);

})();