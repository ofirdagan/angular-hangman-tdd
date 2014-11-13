'use strict';

(function () {

  /* @ngInject */
  function MainController(Game, maxStrikes, $scope, $rootScope, hangmanApi, wordBank) {

    this.maxStrikes = maxStrikes;
    this.categories = [];
    var self = this;

    this.createNewGame = function () {
      wordBank.getNextWord(self.category).then(function (word) {
        self.game = new Game(word);
      });
    };

    this.onCategoryChanged = function () {
      $rootScope.$broadcast('categoryChanged');
      self.createNewGame();
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
