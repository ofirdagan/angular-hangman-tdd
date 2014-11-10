'use strict';

describe('Factory: game', function () {

  // load the service's module
  beforeEach(function () {
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
              callback('Edge of Tomorrow');
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
  var game;
  beforeEach(inject(function (Game) {
    game = new Game();
  }));

  it('should be defined', function () {
    expect(game).toBeDefined();
  });

  it('a new game should have 0 strikes', function () {
    expect(game.strikes).toBe(0);
  });

  it('should start with \'playing\' state ', inject(function (gameState) {
    expect(game.state).toBe(gameState.playing);
  }));

  it('should have first category as the default selected category', inject(function () {
    expect(game.category).toBe('famousCats');
  }));

  it('should get categories list from api service', inject(function (hangmanApi) {
    expect(hangmanApi.getCategories).toHaveBeenCalled();
  }));

  it('should get next word from the wordBank', inject(function (wordBank) {
    expect(wordBank.getNextWord).toHaveBeenCalled();
  }));

  it('should hold a word', inject(function (wordBank) {
    expect(wordBank.getNextWord).toHaveBeenCalledWith(game.category);
    expect(game.word).toBe('Edge of Tomorrow');
  }));

  it('should hold the abc', function () {
    expect(game.abc).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  });

  it('should broadcast the letter that was pressed', inject(function ($rootScope) {
    var revealLetter = jasmine.createSpy('revealLetterSpy');
    $rootScope.$on('revealLetter', revealLetter);

    game.revealLetter('a');

    expect(revealLetter).toHaveBeenCalledWith(jasmine.any(Object), 'a');
  }));

  it('should hold the guessed letters', function () {
    expect(game.guessedLetters).toEqual([]);
    game.revealLetter('a');
    expect(game.guessedLetters).toEqual(['a']);
  });

  it('should count strikes', function () {
    game.word = 'test secret';
    expect(game.strikes).toBe(0);

    game.revealLetter('a');
    expect(game.strikes).toBe(1);

    game.revealLetter('t');
    expect(game.strikes).toBe(1);

    game.revealLetter('d');
    expect(game.strikes).toBe(2);
  });

  it('should change game status to won if player guessed the word', inject(function (gameState) {
    game.word = 'test';
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('t');
    game.revealLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('s');
    expect(game.state).toBe(gameState.won);
  }));

  it('should change game status to won if player guessed the word ignoring case', inject(function (gameState) {
    game.word = 'Test';
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('t');
    game.revealLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('s');
    expect(game.state).toBe(gameState.won);
  }));

  it('should change game status to lost if player did not guessed the word within max strikes', inject(function (gameState, maxStrikes) {
    game.word = 'test';
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
    game.word = 'test';
    game.revealLetter('a');
    expect(game.strikes).toBe(1);
    game.revealLetter('a');
    expect(game.strikes).toBe(1);
  });

  it('should not count strike for case difference', function () {
    game.word = 'Big';
    game.revealLetter('b');
    expect(game.strikes).toBe(0);
  });

  it('should reset the game', inject(function (gameState, $rootScope) {
    game.word = 'test';
    game.strikes = 3;
    game.state = gameState.lost;
    var spy = jasmine.createSpy('resetSpy');
    $rootScope.$on('resetGame', spy);
    game.reset();
    expect(spy).toHaveBeenCalled();
  }));

});
