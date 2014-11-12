'use strict';

(function () {

  /* @ngInject */
  function WordBank(hangmanApi, $q) {
    var availableWords = {};
    var wordBank = {};

    function drawRandomWord(category) {
      if (availableWords[category].length === 0) {
        availableWords[category] = angular.copy(wordBank[category]);
      }
      var index = _.random(availableWords[category].length - 1);
      var word = availableWords[category].splice(index, 1)[0];
      return word;
    }

    function getWordsInCategory(category) {
      return hangmanApi.getWordsInCategory(category).then(function (words) {
        wordBank[category] = words;
        availableWords[category] = [];
        return;
      });
    }

    function fetchWordsFromServerAndDrawWord(category) {
      return getWordsInCategory(category).then(function () {
        return drawRandomWord(category);
      });
    }

    this.getNextWord = function (category) {
      if (!wordBank[category]) {
        return fetchWordsFromServerAndDrawWord(category);
      } else {
        return $q.when(drawRandomWord(category));
      }
    };
  }

  angular
    .module('hangmanAppInternal')
    .service('wordBank', WordBank);

})();
