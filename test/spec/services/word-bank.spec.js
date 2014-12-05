'use strict';

describe('Service: wordBank', function () {

  var $q;
  var wordsMock = ['Terminator', 'Alian', 'c', 'd', 'e', 'f', 'g', 'h'];

  beforeEach(function () {
    module('testUtils');
    module('hangmanAppInternal');
  });

  // instantiate service
  var wordBank;
  beforeEach(inject(function (_wordBank_, _$q_, hangmanApi, testUtils) {
    hangmanApi.getWordsInCategory = testUtils.anAsyncFunc();
    wordBank = _wordBank_;
    $q = _$q_;
  }));

  it('should call server api in case it does not have any words in the category yet', inject(function ($rootScope, hangmanApi) {
    var category = 'movies';
    wordBank.getNextWord(category);
    $rootScope.$digest();
    expect(hangmanApi.getWordsInCategory).toHaveBeenCalledWith(category);
  }));

  it('should return a word according to a category when no cache', inject(function (hangmanApi) {
    var category = 'movies';
    var word = '';

    wordBank.getNextWord(category).then(function (randomWord) {
      word = randomWord;
    });
    hangmanApi.getWordsInCategory.returns(wordsMock);

    expect(wordsMock.indexOf(word) !== -1).toBe(true);
  }));

  it('should return a word according to a category when word bank is cached', inject(function ($rootScope, hangmanApi) {
    var category = 'movies';
    //build the cache
    wordBank.getNextWord(category);
    hangmanApi.getWordsInCategory.returns(wordsMock);

    //ask for it another time
    var wasHereSpy = jasmine.createSpy('washere');
    wordBank.getNextWord(category).then(function (randomWord) {
      wasHereSpy();
      expect(wordsMock.indexOf(randomWord) !== -1).toBe(true);
    });
    $rootScope.$digest();

    //make sure the word got from the cache and not from the server.
    expect(wasHereSpy).toHaveBeenCalled();
    expect(hangmanApi.getWordsInCategory).toHaveBeenCalledOnce();

  }));

  it('should not return same word twice', inject(function ($rootScope, hangmanApi) {
    var category = 'movies';
    var usedWords = [];
    var wasHereSpy = jasmine.createSpy('washere');

    function onWordDrawn(randomWord) {
      wasHereSpy();
      expect(_(usedWords).contains(randomWord)).toBe(false);
      usedWords.push(randomWord);
    }

    for (var i = 0; i < wordsMock.length; i++) {
      wordBank.getNextWord(category).then(onWordDrawn);
      hangmanApi.getWordsInCategory.returns(wordsMock);
    }

    expect(wasHereSpy.calls.length).toBe(wordsMock.length);
  }));

  it('should reset random index in case all of the words have been drawn', inject(function ($rootScope, hangmanApi) {
    var lastWord;
    var wasHereSpy = jasmine.createSpy('washere');

    function onWordDrawn(randomWord) {
      wasHereSpy();
      expect(lastWord).not.toEqual(randomWord);
      lastWord = randomWord;
    }

    _(200).times(function () {
      wordsMock.forEach(function () {
        wordBank.getNextWord().then(onWordDrawn);
        hangmanApi.getWordsInCategory.returns(wordsMock);
      });
      lastWord = undefined;
      expect(wasHereSpy.calls.length).toBe(wordsMock.length);
      wasHereSpy.reset();
    });
  }));
});
