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
      createNewGame();
    };

    $scope.$on('gameOver', function () {
      $rootScope.toggle('gameOverOverlay', 'on');
    });

    function createNewGame() {
      wordBank.getNextWord(self.category).then(function (word) {
        self.game = new Game(word);
      });
    }
  }

  angular
    .module('hangmanAppInternal')
    .controller('MainController', MainController);

})();
