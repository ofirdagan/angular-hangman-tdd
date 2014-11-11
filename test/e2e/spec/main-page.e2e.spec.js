'use strict';

require('../lib/matchers.protractor.js');
var MainPage = require('../pages/main-page.js');

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

  it('should be able to replace categories', function () {
    browser.addMockModule('hangmanAppMocks', function () {
      angular.module('hangmanAppMocks').run(function (serverMockLogic) {
        serverMockLogic.getWordsForCategory = function (category) {
          return category === 'movies' ? ['first'] : ['second word'];
        };
      });
    });

    mainPage.navigate();
    expect(mainPage.getGuess()).toBe('_____');

    mainPage.getCategories().click();
    mainPage.selectCategory(1).click();

    expect(mainPage.getGuess()).toBe('__________');
  });

  it('should change word after replacing the category', function () {
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
  });
});
