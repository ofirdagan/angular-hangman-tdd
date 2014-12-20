'use strict';

(function () {

  /* @ngInject */
  function gameFactory(gameState, maxStrikes) {
    function Game(guessWord) {
      var self = this;
      var selectedLetters = [];
      var MAX_STRIKES = maxStrikes;

      this.charactersInLanguage = 'abcdefghijklmnopqrstuvwxyz'.split('');
      this.strikes = 0;
      this.state = gameState.playing;

      function checkAndUpdateGameStatus() {
        if (self.strikes === MAX_STRIKES) {
          self.state = gameState.lost;
        } else {
          var won = guessWord.toLowerCase().replace(/\s/g, '').split('').every(function (char) {
            return _(selectedLetters).contains(char);
          });
          if (won) {
            self.state = gameState.won;
          }
        }
      }

      this.selectLetter = function (letter) {
        if (self.isLetterSelected(letter)) {
          return;
        }
        selectedLetters.push(letter);
        if (!guessWord.toLowerCase().match(letter)) {
          self.strikes++;
        }
        checkAndUpdateGameStatus();
      };

      this.isLetterSelected = function (char) {
        return selectedLetters.indexOf(char.toLowerCase()) !== -1;
      };

      this.getRevealedLettersArray = function () {
        return guessWord.split('').map(function (char) {
          var shouldShowChar = char === ' ' || self.isLetterSelected(char);
          return shouldShowChar ? char : '_';
        });
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
