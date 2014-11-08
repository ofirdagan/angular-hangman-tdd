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
        scope.isRevealed = false;
        scope.$on('revealLetter', function (args, letter) {
          scope.isRevealed = letter === scope.value;
        });
      }
    };
  }

  angular
    .module('hangmanAppInternal')
    .directive('letter', letter);

})();
