'use strict';

(function () {

  /* @ngInject */
  function MainController(Game, maxStrikes, $scope, $rootScope) {
    this.game = new Game();
    this.abc = this.game.abc;
    this.maxStrikes = maxStrikes;
    var self = this;

    this.onCategoryChanged = function () {
      self.game.setCategory(self.category);
    };

    $scope.$watch(function () {
      return self.game.state;
    }, function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $rootScope.toggle('gameOverOverlay', 'on');
      }
    });

    var unregister = $scope.$watch(function () {
      return self.game.category;
    }, function (newVal, oldVal) {
      if (newVal !== oldVal && oldVal === undefined) {
        self.category = newVal;
        unregister();
      }
    });
  }

  angular
    .module('hangmanAppInternal')
    .controller('MainController', MainController);

})();
