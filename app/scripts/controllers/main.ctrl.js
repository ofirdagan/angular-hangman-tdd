'use strict';

(function () {

  /* @ngInject */
  function MainController(Game, maxStrikes, $scope, $rootScope, hangmanApi, wordBank) {

    this.maxStrikes = maxStrikes;
    this.categories = [];
    this.category = '';
    var self = this;

    hangmanApi.getCategories().then(function (categories) {
      angular.copy(categories, self.categories);
      self.category = categories[0];
      self.onCategoryChanged();
    });

    this.onCategoryChanged = function () {
      $rootScope.$broadcast('categoryChanged');
      self.createNewGame();
    };

    this.createNewGame = function () {
      wordBank.getNextWord(self.category).then(function (word) {
        self.game = new Game(word);
      });
    };

    $scope.$on('gameOver', function () {
      $rootScope.toggle('gameOverOverlay', 'on');
    });
  }

  angular
    .module('hangmanAppInternal')
    .controller('MainController', MainController);

})();
