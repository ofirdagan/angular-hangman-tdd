'use strict';

describe('Factory: game', function () {

  // load the service's module
  beforeEach(function () {
    module('hangmanAppInternal');
    module(function ($provide) {
      $provide.constant('maxStrikes', 5);
    });
  });

  it('should be defined', function () {
    expect(aGame()).toBeDefined();
  });

  it('a new game should have 0 strikes', function () {
    expect(aGame().strikes).toBe(0);
  });

  it('should start with \'playing\' state ', inject(function (gameState) {
    expect(aGame().state).toBe(gameState.playing);
  }));

  it('should have the characters in language', function () {
    var game = aGame();

    expect(game.charactersInLanguage).toEqual('abcdefghijklmnopqrstuvwxyz'.split(''));
  });

  it('should select letters', inject(function () {
    //given
    var game = aGame('Chazz Michael Michaels');

    //when
    game.selectLetter('a');

    //then
    expect(game.isLetterSelected('a')).toBe(true);
    expect(game.isLetterSelected('i')).toBe(false);
  }));

  it('should return the phrase in its current status', function () {
    var game = aGame('google campus');

    expect(game.getRevealedLettersArray()).toEqual('______ ______'.split(''));

    game.selectLetter('a');
    expect(game.getRevealedLettersArray()).toEqual('______ _a____'.split(''));

    game.selectLetter('o');
    expect(game.getRevealedLettersArray()).toEqual('_oo___ _a____'.split(''));

    game.selectLetter('z');
    expect(game.getRevealedLettersArray()).toEqual('_oo___ _a____'.split(''));
  });

  it('should reveal capital letters when letter is selected', function () {
    var game = aGame('CAC');

    game.selectLetter('a');
    expect(game.getRevealedLettersArray()).toEqual('_A_'.split(''));

    game.selectLetter('c');
    expect(game.getRevealedLettersArray()).toEqual('CAC'.split(''));
  });

  it('should count strikes correctly', function () {
    var game = aGame('test secret');
    expect(game.strikes).toBe(0);

    game.selectLetter('a');
    expect(game.strikes).toBe(1);

    game.selectLetter('t');
    expect(game.strikes).toBe(1);

    game.selectLetter('d');
    expect(game.strikes).toBe(2);
  });

  it('should count strikes correctly with capital letters', function () {
    var game = aGame('Test secret');
    expect(game.strikes).toBe(0);

    game.selectLetter('a');
    expect(game.strikes).toBe(1);

    game.selectLetter('t');
    expect(game.strikes).toBe(1);
  });

  it('should change game status to won if player guessed the word', inject(function (gameState) {
    var game = aGame('test a');
    expect(game.state).toBe(gameState.playing);
    game.selectLetter('t');
    game.selectLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.selectLetter('s');
    game.selectLetter('a');
    expect(game.state).toBe(gameState.won);
  }));

  it('should change game status to won if player guessed the word ignoring case', inject(function (gameState) {
    var game = aGame('Test');
    expect(game.state).toBe(gameState.playing);
    game.selectLetter('t');
    game.selectLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.selectLetter('s');
    expect(game.state).toBe(gameState.won);
  }));

  it('should change game status to lost if player did not guessed the word within max strikes', inject(function (gameState, maxStrikes) {
    var game = aGame('test');
    expect(game.state).toBe(gameState.playing);
    expect(maxStrikes).toBe(5);

    game.selectLetter('t');
    game.selectLetter('e');
    expect(game.state).toBe(gameState.playing);
    game.selectLetter('a');
    game.selectLetter('b');
    game.selectLetter('c');
    game.selectLetter('d');
    expect(game.state).toBe(gameState.playing);
    game.selectLetter('r');

    expect(game.state).toBe(gameState.lost);
  }));

  it('should not count strike twice for the same letter', function () {
    var game = aGame('test');
    game.selectLetter('a');
    expect(game.strikes).toBe(1);
    game.selectLetter('a');
    expect(game.strikes).toBe(1);
  });

  it('should not count strike for case difference', function () {
    var game = aGame('Big');
    game.selectLetter('b');
    expect(game.strikes).toBe(0);
  });

  function aGame(word) {
    var game;
    word = word || 'Edge of Tomorrow';
    inject(function (Game) {
      game = new Game(word);
    });
    return game;
  }

});
