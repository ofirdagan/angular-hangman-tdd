'use strict';

require('../lib/matchers.protractor.js');
var MainPage = require('../pages/main-page.js');
var GameOverModal = require('../modals/game-over-modal.js');

describe('hangmanApp Main Page', function () {
  var mainPage;

  beforeEach(function () {
    mainPage = new MainPage();
    browser.addMockModule('hangmanAppMocks', function () {});
  });

  afterEach(function () {
    browser.removeMockModule('hangmanAppMocks');
  });

  it('should load successfully', function () {
    mainPage.navigate();
    expect(mainPage.getTitle()).toEqual('Hangman');
  });

  it('should show current category', function () {
    mainPage.navigate();
    expect(mainPage.getCurrentCategory()).toEqual('Movies');
  });

  it('should change word after replacing the category', function () {
    var firstWord = 'first';
    browser.addMockModule('hangmanAppMocks', function (firstWord) {
      angular.module('hangmanAppMocks').run(function (serverMockLogic) {
        serverMockLogic.getWordsForCategory = function (category) {
          return category === 'movies' ? [firstWord] : ['second word'];
        };
      });
    }, firstWord);

    mainPage.navigate();
    expect(mainPage.getGuess()).toBe(firstWord.replace(/./g, '_'));

    mainPage.getCategories().click();
    mainPage.selectCategory(1).click();

    expect(mainPage.getGuess()).toBe('__________');
  });

  it('should be able to replace categories', function () {
    mainPage.navigate();
    mainPage.getCategories().click();
    mainPage.selectCategory(1).click();
    expect(mainPage.getCurrentCategory()).toEqual('Countries Capitals');
  });

  it('should show current strikes', function () {
    mainPage.navigate();
    expect(mainPage.getCurrentStrikes()).toEqual('Strikes: 0/8');
  });

  describe('db with 1 word', function () {
    beforeEach(function () {
      browser.addMockModule('hangmanAppMocks', function () {
        angular.module('hangmanAppMocks').run(function (serverMockLogic) {
          serverMockLogic.getWordsForCategory = function () {
            return ['a test word'];
          };
        });
      });
      mainPage.navigate();
    });

    it('should reveal letter on the right letter click', function () {
      expect(mainPage.getGuess()).toBe('_________');

      mainPage.getChar('a').click();
      expect(mainPage.getGuess()).toBe('a________');

      mainPage.getChar('o').click();
      expect(mainPage.getGuess()).toBe('a_____o__');
    });

    it('should update strikes', function () {
      mainPage.getChar('z').click();
      expect(mainPage.getCurrentStrikes()).toEqual('Strikes: 1/8');

      mainPage.getChar('f').click();
      expect(mainPage.getCurrentStrikes()).toEqual('Strikes: 2/8');
    });

    it('should draw hangman on wrong guess', function () {
      expect(mainPage.getDraw().getVisibleStrikes()).toBe(0);

      mainPage.getChar('z').click();
      expect(mainPage.getDraw().getVisibleStrikes()).toBe(1);

      mainPage.getChar('f').click();
      expect(mainPage.getDraw().getVisibleStrikes()).toBe(2);
    });

    it('should add class on guessed letters', function () {
      mainPage.getChar('z').click();

      expect(mainPage.getChar('z')).toHaveClass('guessed-char');
    });

    it('should win a game', function () {
      mainPage.getChar('t').click();
      mainPage.getChar('w').click();
      mainPage.getChar('r').click();
      mainPage.getChar('a').click();
      mainPage.getChar('d').click();
      mainPage.getChar('e').click();
      mainPage.getChar('s').click();
      mainPage.getChar('o').click();

      var modal = new GameOverModal();
      expect(modal.getText()).toBe('You won!');
    });

    it('should lose a game', function () {
      mainPage.getChar('a').click();
      mainPage.getChar('b').click();
      mainPage.getChar('c').click();
      mainPage.getChar('d').click();
      mainPage.getChar('e').click();
      mainPage.getChar('f').click();
      mainPage.getChar('g').click();
      mainPage.getChar('h').click();
      mainPage.getChar('i').click();
      mainPage.getChar('j').click();
      mainPage.getChar('k').click();
      var modal = new GameOverModal();
      expect(modal.getText()).toBe('You lost!');
    });

    it('should start a new game after game is over', function () {
      mainPage.getChar('a').click();
      mainPage.getChar('b').click();
      mainPage.getChar('c').click();
      mainPage.getChar('d').click();
      mainPage.getChar('e').click();
      mainPage.getChar('f').click();
      mainPage.getChar('g').click();
      mainPage.getChar('h').click();
      mainPage.getChar('i').click();
      mainPage.getChar('j').click();

      expect(mainPage.getGuess()).toBe('a_e_____d');

      mainPage.getChar('k').click();
      var modal = new GameOverModal();
      modal.getOkButton().click();
      expect(mainPage.getGuess()).toBe('___________');
    });
  });
});
