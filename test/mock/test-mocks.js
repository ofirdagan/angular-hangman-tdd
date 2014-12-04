'use strict';
angular.module('testUtils', [])
  .service('testUtils', function ($q, $rootScope) {
    function createAsyncFunc() {
      var defer;
      var func = jasmine.createSpy().andCallFake(function () {
        defer = $q.defer();
        return defer.promise;
      });

      func.returns = function (value) {
        defer.resolve(value);
        $rootScope.$digest();
      };

      return func;
    }

    this.aHangmanApi = function () {
      return {
        getCategories: createAsyncFunc()
      };
    };

    this.aWordBank = function () {
      return {
        getNextWord: createAsyncFunc()
      };
    };
  });
