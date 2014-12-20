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

    expect(mainPage.getGuess()).toBe('______ ____');
  });

  it('should be able to replace categories', function () {
    mainPage.navigate();
    mainPage.getCategories().click();
    mainPage.selectCategory(1).click();
    expect(mainPage.getCurrentCategory()).toEqual('Countries Capitals');
  });

  it('should show current strikes', function () {
    mainPage.navigate();
    expect(mainPage.getCurrentStrikes()).toEqual('0/8');
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

    it('should add white-space class to white spaces', function () {
      expect(mainPage.getGuessWordLetterAt(1)).toHaveClass('white-space');
    });

    it('should reveal letter on the right letter click', function () {
      expect(mainPage.getGuess()).toBe('_ ____ ____');

      mainPage.getKeyboard().getKey('a').click();
      expect(mainPage.getGuess()).toBe('a ____ ____');

      mainPage.getKeyboard().getKey('o').click();
      expect(mainPage.getGuess()).toBe('a ____ _o__');
    });

    it('should update strikes', function () {
      mainPage.getKeyboard().getKey('z').click();
      expect(mainPage.getCurrentStrikes()).toEqual('1/8');

      mainPage.getKeyboard().getKey('f').click();
      expect(mainPage.getCurrentStrikes()).toEqual('2/8');
    });

    it('should draw hangman on wrong guess', function () {
      expect(mainPage.getDraw().getVisibleStrikes()).toBe(0);

      mainPage.getKeyboard().getKey('z').click();
      expect(mainPage.getDraw().getVisibleStrikes()).toBe(1);

      mainPage.getKeyboard().getKey('f').click();
      expect(mainPage.getDraw().getVisibleStrikes()).toBe(2);
    });

    it('should add class on selected letters', function () {
      mainPage.getKeyboard().getKey('z').click();

      expect(mainPage.getKeyboard().getKey('z')).toHaveClass('was-selected');
    });

    it('should win a game', function () {
      mainPage.getKeyboard().getKey('t').click();
      mainPage.getKeyboard().getKey('w').click();
      mainPage.getKeyboard().getKey('r').click();
      mainPage.getKeyboard().getKey('a').click();
      mainPage.getKeyboard().getKey('d').click();
      mainPage.getKeyboard().getKey('e').click();
      mainPage.getKeyboard().getKey('s').click();
      mainPage.getKeyboard().getKey('o').click();

      var modal = new GameOverModal();
      expect(modal.getText()).toBe('You won!');
    });

    it('should lose a game', function () {
      mainPage.getKeyboard().getKey('a').click();
      mainPage.getKeyboard().getKey('b').click();
      mainPage.getKeyboard().getKey('c').click();
      mainPage.getKeyboard().getKey('d').click();
      mainPage.getKeyboard().getKey('e').click();
      mainPage.getKeyboard().getKey('f').click();
      mainPage.getKeyboard().getKey('g').click();
      mainPage.getKeyboard().getKey('h').click();
      mainPage.getKeyboard().getKey('i').click();
      mainPage.getKeyboard().getKey('j').click();
      mainPage.getKeyboard().getKey('k').click();
      var modal = new GameOverModal();
      expect(modal.getText()).toBe('You lost!');
    });

    it('should start a new game after game is over', function () {
      mainPage.getKeyboard().getKey('a').click();
      mainPage.getKeyboard().getKey('b').click();
      mainPage.getKeyboard().getKey('c').click();
      mainPage.getKeyboard().getKey('d').click();
      mainPage.getKeyboard().getKey('e').click();
      mainPage.getKeyboard().getKey('f').click();
      mainPage.getKeyboard().getKey('g').click();
      mainPage.getKeyboard().getKey('h').click();
      mainPage.getKeyboard().getKey('i').click();
      mainPage.getKeyboard().getKey('j').click();

      expect(mainPage.getGuess()).toBe('a _e__ ___d');

      mainPage.getKeyboard().getKey('k').click();
      var modal = new GameOverModal();
      modal.getOkButton().click();
      expect(mainPage.getGuess()).toBe('_ ____ ____');
    });
  });
});
