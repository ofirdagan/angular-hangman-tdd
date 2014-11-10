'use strict';

(function () {

  /* @ngInject */
  function MainController(Game, maxStrikes, $scope, $rootScope) {
    this.game = new Game();
    this.abc = this.game.abc;
    this.maxStrikes = maxStrikes;
    var self = this;

    $scope.$watch(function () {
      return self.game.state;
    }, function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $rootScope.toggle('gameOverOverlay', 'on');
      }
    });
  }

  angular
    .module('hangmanAppInternal')
    .controller('MainController', MainController);

})();
