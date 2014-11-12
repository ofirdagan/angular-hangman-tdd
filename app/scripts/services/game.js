'use strict';

(function () {

  /* @ngInject */
  function gameFactory(gameState, $rootScope, maxStrikes) {
    function Game(word) {
      var self = this;
      var guessedLetters = [];
      var MAX_STRIKES = maxStrikes;

      this.abc = 'abcdefghijklmnopqrstuvwxyz'.split('');
      this.word = word;
      this.strikes = 0;
      this.state = gameState.playing;

      function checkAndUpdateGameStatus() {
        if (self.strikes === MAX_STRIKES) {
          self.state = gameState.lost;
        } else {
          var won = self.word.toLowerCase().replace(/\s/g, '').split('').every(function (char) {
            return _(guessedLetters).contains(char);
          });
          if (won) {
            self.state = gameState.won;
          }
        }
        if (self.state !== gameState.playing) {
          $rootScope.$broadcast('gameOver', self.state);
        }
      }

      this.alreadyGuessed = function (letter) {
        return _(guessedLetters).contains(letter);
      };

      this.revealLetter = function (letter) {
        if (self.alreadyGuessed(letter)) {
          return;
        }
        guessedLetters.push(letter);
        if (!self.word.toLowerCase().match(letter)) {
          self.strikes++;
        }
        checkAndUpdateGameStatus();
        $rootScope.$broadcast('revealLetter', letter);
      };
    }
    return Game;
  }

  angular
    .module('hangmanAppInternal')
    .factory('Game', gameFactory)
    .constant('gameState', ['playing', 'won', 'lost'].reduce(function (acc, current) {
      acc[current] = current;
      return acc;
    }, {}))
    .constant('maxStrikes', 8);

})();
