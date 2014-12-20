'use strict';
angular.module('hangmanTestKit', ['tada'])
  .service('hangmanApiMock', function (tadaUtils) {
    this.getCategories =  tadaUtils.anAsyncFunc();
    this.getWordsInCategory =  tadaUtils.anAsyncFunc();
  })
  .service('wordBankMock', function (tadaUtils) {
    this.getNextWord = tadaUtils.anAsyncFunc();
  })
  .service('GameMock', function (tadaUtils) {
    return jasmine.createSpy('Game').andCallFake(function () {
      return {
        selectLetter: tadaUtils.aSyncedFunc(),
        state: 'playing'
      };
    });
  });
