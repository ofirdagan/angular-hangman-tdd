'use strict';

(function () {

  /* @ngInject */
  function gameFactory(gameState, wordBank, hangmanApi, $rootScope, maxStrikes) {
    function Game() {
      var self = this;
      var MAX_STRIKES = maxStrikes;
      this.abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      this.word = '';
      this.categories = [];

      function resetFields() {
        self.strikes = 0;
        self.state = gameState.playing;
        self.guessedLetters = [];
      }
      resetFields();

      function checkAndUpdateGameStatus() {
        if (self.strikes === MAX_STRIKES) {
          self.state = gameState.lost;
          return;
        }
        var won = self.word.toLowerCase().split('').every(function (char) {
          return _(self.guessedLetters).contains(char);
        });
        if (won) {
          self.state = gameState.won;
        }
      }

      function getNewWord() {
        wordBank.getNextWord(self.category).then(function (word) {
          self.word = word;
        });
      }

      this.alreadyGuessed = function (letter) {
        return _(self.guessedLetters).contains(letter);
      };

      this.revealLetter = function (letter) {
        if (self.alreadyGuessed(letter)) {
          return;
        }
        self.guessedLetters.push(letter);
        if (!self.word.toLowerCase().match(letter)) {
          self.strikes++;
        }
        checkAndUpdateGameStatus();
        $rootScope.$broadcast('revealLetter', letter);
      };

      this.reset = function () {
        getNewWord();
        resetFields();
        $rootScope.$broadcast('resetGame');
      };

      this.setCategory = function (category) {
        self.category = category;
        self.reset();
      };

      hangmanApi.getCategories().then(function (categories) {
        angular.copy(categories, self.categories);
        self.setCategory(categories[0]);
      });
    }
    return Game;
  }

  angular
    .module('hangmanAppInternal')
    .factory('Game', gameFactory)
    .constant('gameState', ['playing', 'won', 'lost'].reduce(function (res, curr) {
      res[curr] = curr;
      return res;
    }, {}))
    .constant('maxStrikes', 8);

})();
