'use strict';

(function () {

  /* @ngInject */
  function HangmanApi($http) {

    this.getCategories = function () {
      return $http.get('_api/categories').then(function (response) {
        return response.data;
      });
    };

    this.getWordsInCategory = function (category) {
      return $http.get('_api/category/' + category + '/words', {cache: true}).then(function (response) {
        return response.data;
      });
    };

  }

  angular
    .module('hangmanAppInternal')
    .service('hangmanApi', HangmanApi);

})();
