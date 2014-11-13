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

  function aGame(word) {
    var game;
    word = word || 'Edge of Tomorrow';
    inject(function (Game) {
      game = new Game(word);
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

  it('should hold the game phrase and return the same object every time', inject(function () {
    var game = aGame('Edge');

    var phrase = game.getPhrase();

    expect(phrase).toEqual([{val: 'E'}, {val: 'd'}, {val: 'g'}, {val: 'e'}]);
    expect(game.getPhrase()).toBe(phrase);
  }));

  it('should hold the abc', function () {
    expect(aGame().abc).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
  });

  it('should broadcast the letter that was pressed', inject(function ($rootScope) {
    var revealLetter = jasmine.createSpy('revealLetterSpy');
    $rootScope.$on('revealLetter', revealLetter);

    aGame().revealLetter('a');

    expect(revealLetter).toHaveBeenCalledWith(jasmine.any(Object), 'a');
  }));

  it('should hold the guessed letters', function () {
    var game = aGame();
    expect(game.alreadyGuessed('a')).toBe(false);
    game.revealLetter('a');
    expect(game.alreadyGuessed('a')).toBe(true);
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
    var game = aGame('test a');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('t');
    game.revealLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.revealLetter('s');
    game.revealLetter('a');
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

  it('should change game status to lost if player did not guessed the word within max strikes', inject(function (gameState, maxStrikes, $rootScope) {
    var game = aGame('test');
    var gameOverSpy = jasmine.createSpy('game over spy');
    $rootScope.$on('gameOver', gameOverSpy);
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
    expect(gameOverSpy).toHaveBeenCalledWith(jasmine.any(Object), 'lost');
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
});
