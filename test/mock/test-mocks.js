'use strict';
angular.module('testUtils', [])
  .service('testUtils', function ($q, $rootScope) {

    function createAsyncFunc() {
      var defer = $q.defer();
      var firstCall = true;
      var func = jasmine.createSpy().andCallFake(function () {
        defer = firstCall ? defer : $q.defer();
        firstCall = false;
        return defer.promise;
      });

      func.returns = function (value) {
        defer.resolve(value);
        $rootScope.$digest();
      };

      return func;
    }

    this.anAsyncFunc = createAsyncFunc;

    this.aHangmanApi = function () {
      return {
        getCategories: createAsyncFunc(),
        getWordsInCategory: createAsyncFunc()
      };
    };

    this.aWordBank = function () {
      return {
        getNextWord: createAsyncFunc()
      };
    };
  });
