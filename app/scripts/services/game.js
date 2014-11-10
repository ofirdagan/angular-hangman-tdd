'use strict';

(function () {

  /* @ngInject */
  function gameFactory(gameState, wordBank, hangmanApi, $rootScope, maxStrikes) {
    function Game() {
      var self = this;
      var MAX_STRIKES = maxStrikes;
      this.strikes = 0;
      this.state = gameState.playing;
      this.abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      this.guessedLetters = [];
      this.word = '';
      this.categories = [];

      function checkGameStatus() {
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

      function alreadyGuessed(letter) {
        return _(self.guessedLetters).contains(letter);
      }

      this.revealLetter = function (letter) {
        if (alreadyGuessed(letter)) {
          return;
        }
        self.guessedLetters.push(letter);
        if (!self.word.toLowerCase().match(letter)) {
          self.strikes++;
        }
        checkGameStatus();
        $rootScope.$broadcast('revealLetter', letter);
      };

      this.reset = function () {
        wordBank.getNextWord(self.category).then(function (word) {
          self.word = word;
        });
        self.strikes = 0;
        self.state = gameState.playing;
        $rootScope.$broadcast('resetGame');
      };

      hangmanApi.getCategories().then(function (categories) {
        angular.copy(categories, self.categories);
        self.category = categories[0];
        wordBank.getNextWord(self.category).then(function (word) {
          self.word = word;
        });
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
    .constant('maxStrikes', 5);

})();
