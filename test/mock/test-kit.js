'use strict';
angular.module('hangmanTestKit', ['tada'])
  .service('hangmanApiMock', function (tadaUtils) {
    this.getCategories =  tadaUtils.anAsyncFunc();
    this.getWordsInCategory =  tadaUtils.anAsyncFunc();
  })
  .service('wordBankMock', function (tadaUtils) {
    this.getNextWord = tadaUtils.anAsyncFunc();
  });
