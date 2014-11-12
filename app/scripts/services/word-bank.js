'use strict';

(function () {

  /* @ngInject */
  function WordBank(hangmanApi, $q) {
    var usedWordsCountByCategory = {};
    var wordBank = {};

    function getMaxIndexForCategory(category) {
      var totalWordsInCategory = wordBank[category].length;
      if (totalWordsInCategory === usedWordsCountByCategory[category]) {
        usedWordsCountByCategory[category] = 0;
      }
      return totalWordsInCategory - 1 - usedWordsCountByCategory[category];
    }

    function drawRandomWord(category) {
      var maxIndexForCategory = getMaxIndexForCategory(category);
      var index = _.random(maxIndexForCategory);
      var word = wordBank[category].splice(index, 1)[0];
      wordBank[category].push(word);
      usedWordsCountByCategory[category]++;
      return word;
    }

    function getWordsInCategory(category) {
      return hangmanApi.getWordsInCategory(category).then(function (words) {
        wordBank[category] = words;
        usedWordsCountByCategory[category] = 0;
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
