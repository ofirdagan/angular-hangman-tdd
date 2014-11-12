'use strict';

describe('Factory: game', function () {
  var currentWord;

  // load the service's module
  beforeEach(function () {
    currentWord = 'Edge of Tomorrow';
    module('hangmanAppInternal', {
      hangmanApi: {
        getCategories: jasmine.createSpy('getCategories').andReturn({
          then: function (callback) {
            callback(['famousCats', 'countriesCapitals']);
          }
        })
      },
      wordBank: {
        getNextWord: jasmine.createSpy('getNextWord').andCallFake(function () {
          return {
            then: function (callback) {
              callback(currentWord);
            }
          };
        })
      }
    });
    module(function ($provide) {
      $provide.constant('maxStrikes', 5);
    });
  });

  // instantiate service
  function aGame(word) {
    var game;
    currentWord = word || currentWord;
    inject(function (Game) {
      game = new Game();
    });
    return game;
  }

  it('should be defined', function () {
    expect(aGame()).toBeDefined();
  });

  it('a new game should have 0 strikes', function () {
    expect(aGame().strikes).toBe(0);
  });

  it('should start with \'playing\' state ', inject(function (gameState) {
    expect(aGame().state).toBe(gameState.playing);
  }));

  it('should have first category as the default selected category', inject(function () {
    expect(aGame().category).toBe('famousCats');
  }));

  it('should get categories list from api service', inject(function (hangmanApi) {
    aGame();
    expect(hangmanApi.getCategories).toHaveBeenCalled();
  }));

  it('should get next word from the wordBank', inject(function (wordBank) {
    aGame();
    expect(wordBank.getNextWord).toHaveBeenCalled();
  }));

  it('should call getNext word on category change', inject(function () {
    var game = aGame();
    spyOn(game, 'reset').andCallThrough();

    game.setCategory('yoba');

    expect(game.reset).toHaveBeenCalled();
  }));

  it('should set category on category change', inject(function () {
    var game = aGame();
    game.category = 'olin';
    game.setCategory('yoba');
    expect(game.category).toBe('yoba');
  }));

  it('should hold a word', inject(function (wordBank) {
    var game = aGame();
    expect(wordBank.getNextWord).toHaveBeenCalledWith(game.category);
    expect(game.word).toBe('edge of tomorrow');
  }));

  it('should hold the abc', function () {
    expect(aGame().abc).toEqual('abcdefghijklmnopqrstuvwxyz'.split(''));
  });

  it('should broadcast the letter that was pressed', inject(function ($rootScope) {
    var revealLetter = jasmine.createSpy('revealLetterSpy');
    $rootScope.$on('revealLetter', revealLetter);

    aGame().revealLetter('a');

    expect(revealLetter).toHaveBeenCalledWith(jasmine.any(Object), 'a');
  }));

  it('should hold the guessed letters', function () {
    var game = aGame();
    expect(game.guessedLetters).toEqual([]);
    game.revealLetter('a');
    expect(game.guessedLetters).toEqual(['a']);
  });

  it('should count strikes', function () {
    var game = aGame('test secret');
    expect(game.strikes).toBe(0);

    game.revealLetter('a');
    expect(game.strikes).toBe(1);

    game.revealLetter('t');
    expect(game.strikes).toBe(1);

    game.revealLetter('d');
    expect(game.strikes).toBe(2);
  });

  it('should change game status to won if player guessed the word', inject(function (gameState) {
    var game = aGame('test');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('t');
    game.revealLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('s');
    expect(game.state).toBe(gameState.won);
  }));

  it('should change game status to won if player guessed the word ignoring case', inject(function (gameState) {
    var game = aGame('Test');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('t');
    game.revealLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('s');
    expect(game.state).toBe(gameState.won);
  }));

  it('should change game status to lost if player did not guessed the word within max strikes', inject(function (gameState, maxStrikes) {
    var game = aGame('test');
    expect(game.state).toBe(gameState.playing);
    expect(maxStrikes).toBe(5);

    game.revealLetter('t');
    game.revealLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('a');
    game.revealLetter('b');
    game.revealLetter('c');
    game.revealLetter('d');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('r');
    expect(game.state).toBe(gameState.lost);
  }));

  it('should not count strike twice for the same letter', function () {
    var game = aGame('test');
    game.revealLetter('a');
    expect(game.strikes).toBe(1);
    game.revealLetter('a');
    expect(game.strikes).toBe(1);
  });

  it('should not count strike for case difference', function () {
    var game = aGame('Big');
    game.revealLetter('b');
    expect(game.strikes).toBe(0);
  });

  it('should reset the game', inject(function (gameState, $rootScope) {
    var game = aGame('test');
    game.strikes = 3;
    game.state = gameState.lost;
    game.guessedLetters = ['a'];
    var spy = jasmine.createSpy('resetSpy');
    $rootScope.$on('resetGame', spy);

    game.reset();

    expect(game.state).toBe(gameState.playing);
    expect(spy).toHaveBeenCalled();
    expect(game.strikes).toBe(0);
    expect(game.guessedLetters).toEqual([]);
  }));
});
