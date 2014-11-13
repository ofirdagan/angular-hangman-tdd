'use strict';

(function () {

  /* @ngInject */
  function letter() {
    return {
      templateUrl: 'views/letter.preload.html',
      restrict: 'E',
      scope: {
        letterObj: '=value'
      },
      link: function postLink(scope) {
        scope.isWhiteSpace = !scope.letterObj.val || scope.letterObj.val === ' ';
        scope.isRevealed = scope.isWhiteSpace;
        scope.$on('revealLetter', function (args, letter) {
          scope.isRevealed = scope.isRevealed || letter.toLowerCase() === scope.letterObj.val.toLowerCase();
        });
        scope.$on('gameOver', function () {
          scope.isRevealed = false;
        });
      }
    };
  }

  angular
    .module('hangmanAppInternal')
    .directive('letter', letter);

})();
