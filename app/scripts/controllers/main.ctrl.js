'use strict';

(function () {

  /* @ngInject */
  function MainController(Game, maxStrikes, $scope, $rootScope, hangmanApi, wordBank) {

    this.maxStrikes = maxStrikes;
    this.categories = [];
    var self = this;

    this.onCategoryChanged = function () {
      wordBank.getNextWord(self.category).then(function (word) {
        self.game = new Game(word);
      });
    };

    $scope.$on('gameOver', function () {
      $rootScope.toggle('gameOverOverlay', 'on');
    });

    hangmanApi.getCategories().then(function (categories) {
      angular.copy(categories, self.categories);
      self.category = categories[0];
      self.onCategoryChanged();
    });

  }

  angular
    .module('hangmanAppInternal')
    .controller('MainController', MainController);

})();
