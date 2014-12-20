'use strict';

(function () {

  /* @ngInject */
  function MainController(Game, maxStrikes, $scope, hangmanApi, wordBank, hangmanEvents, gameState) {

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
      self.createNewGame();
    };

    this.createNewGame = function () {
      wordBank.getNextWord(self.category).then(function (word) {
        self.game = new Game(word);
      });
    };

    $scope.$watch(function () {
      return self.game ? self.game.state : undefined;
    }, function (value) {
      if (value !== gameState.playing) {
        $scope.toggle('gameOverOverlay', 'on');
      }
    });

    $scope.$on(hangmanEvents.letterSelected, function (event, letter) {
      self.game.selectLetter(letter);
    });
  }

  angular
    .module('hangmanAppInternal')
    .controller('MainController', MainController);

})();
