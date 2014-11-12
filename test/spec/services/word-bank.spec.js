'use strict';

describe('Service: wordBank', function () {

  var $q;
  var wordsMock = ['Terminator', 'Alian', 'c', 'd', 'e', 'f', 'g', 'h'];
  // load the service's module
  beforeEach(function () {
    module('hangmanAppInternal');
    module({
      hangmanApi: {
        getWordsInCategory: function () {
          var d = $q.defer();
          d.resolve(wordsMock);
          return d.promise;
        }
      }
    });
  });

  // instantiate service
  var wordBank;
  beforeEach(inject(function (_wordBank_, _$q_) {
    wordBank = _wordBank_;
    $q = _$q_;
  }));

  it('should call server api in case it does not have any words in the category yet', inject(function ($rootScope, hangmanApi) {
    var category = 'movies';
    spyOn(hangmanApi, 'getWordsInCategory').andCallThrough();
    wordBank.getNextWord(category);
    $rootScope.$digest();
    expect(hangmanApi.getWordsInCategory).toHaveBeenCalledWith(category);
  }));

  it('should return a word according to a category when no cache', inject(function ($rootScope) {
    var category = 'movies';
    var wasHereSpy = jasmine.createSpy('washere');
    wordBank.getNextWord(category).then(function (randomWord) {
      wasHereSpy();
      expect(wordsMock.some(function (word) {
        return word === randomWord;
      })).toBe(true);
    });
    $rootScope.$digest();
    expect(wasHereSpy).toHaveBeenCalled();
  }));

  it('should return a word according to a category when word bank is cached', inject(function ($rootScope, hangmanApi) {
    var category = 'movies';
    //build the cache
    spyOn(hangmanApi, 'getWordsInCategory').andCallThrough();
    wordBank.getNextWord(category);
    $rootScope.$digest();

    //ask for it another time
    var wasHereSpy = jasmine.createSpy('washere');
    wordBank.getNextWord(category).then(function (randomWord) {
      wasHereSpy();
      expect(wordsMock.some(function (word) {
        return word === randomWord;
      })).toBe(true);
    });
    $rootScope.$digest();

    //make sure the word got from the cache and not from the server.
    expect(wasHereSpy).toHaveBeenCalled();
    expect(hangmanApi.getWordsInCategory.calls.length).toBe(1);

  }));

  it('should not return same word twice', inject(function ($rootScope) {
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
      $rootScope.$digest();
    }

    expect(wasHereSpy.calls.length).toBe(wordsMock.length);
  }));

  it('should reset random index in case all of the words have been drawn', inject(function ($rootScope) {
    var lastWord;
    var wasHereSpy = jasmine.createSpy('washere');

    function onWordDrawn(randomWord) {
      wasHereSpy();
      expect(lastWord).not.toEqual(randomWord);
      lastWord = randomWord;
    }

    for (var i = 0; i < wordsMock.length * 3; i++) {
      wordBank.getNextWord().then(onWordDrawn);
      $rootScope.$digest();
    }

    expect(wasHereSpy.calls.length).toBe(wordsMock.length * 3);
  }));
});
