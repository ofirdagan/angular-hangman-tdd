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
    expect(mainPage.getCurrentCategory()).toEqual('Category: Movies');
  });

  it('should show current strikes', function () {
    mainPage.navigate();
    expect(mainPage.getCurrentStrikes()).toEqual('Strikes: 0/5');
  });

  it('should reveal letter on the right letter click', function () {
    browser.addMockModule('hangmanAppMocks', function () {
      angular.module('hangmanAppMocks').run(function (serverMockLogic) {
        console.log('bla');
        serverMockLogic.getWordsForCategory = function () {
          console.log('here');
          return ['a test word'];
        };
      });
    });
    mainPage.navigate();
    expect(mainPage.getGuess()).toBe('_ ____ ____');

    mainPage.getChar('a').click();
    expect(mainPage.getGuess()).toBe('a ____ ____');

    mainPage.getChar('o').click();
    expect(mainPage.getGuess()).toBe('a ____ _o__');
  });

});
