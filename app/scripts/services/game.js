'use strict';

(function () {

  /* @ngInject */
  function gameFactory(gameState, $rootScope, maxStrikes) {
    function Game(pharse) {
      var self = this;
      var guessedLetters = [];
      var MAX_STRIKES = maxStrikes;
      var word = pharse;

      this.abc = 'abcdefghijklmnopqrstuvwxyz'.split('');
      this.strikes = 0;
      this.state = gameState.playing;

      function checkAndUpdateGameStatus() {
        if (self.strikes === MAX_STRIKES) {
          self.state = gameState.lost;
        } else {
          var won = word.toLowerCase().replace(/\s/g, '').split('').every(function (char) {
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

      this.getPhrase = function () {
        if (self.phrase) {
          return self.phrase;
        }
        self.phrase = word.split('').reduce(function (acc, letter) {
          acc.push({val: letter});
          return acc;
        }, []);
        return self.phrase;
      };

      this.alreadyGuessed = function (letter) {
        return _(guessedLetters).contains(letter);
      };

      this.revealLetter = function (letter) {
        if (self.alreadyGuessed(letter)) {
          return;
        }
        guessedLetters.push(letter);
        if (!word.toLowerCase().match(letter)) {
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
