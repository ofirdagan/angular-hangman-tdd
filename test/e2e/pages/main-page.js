'use strict';

var Draw = require('../fragments/draw.js');
var Keyboard = require('../fragments/keyboard.js');

function MainPage() {
  this.navigate = function () {
    browser.get('/');
  };

  this.getTitle = function () {
    return $('h1').getText();
  };

  this.getCurrentCategory = function () {
    return $('.category-select option:checked').getText();
  };

  this.getCurrentStrikes = function () {
    return $('.strikes').getText();
  };

  this.getGuess = function () {
    return $('.word').getText().then(function (text) {
      return text.replace(/(\r\n|\n|\r)/gm, '');
    });
  };

  this.getGuessWordLetterAt = function (index) {
    return $$('.letter').get(index);
  };

  this.getCategories = function () {
    return $('.category-select');
  };

  this.selectCategory = function (optionIndex) {
    return $$('.category-select option').get(optionIndex);
  };

  this.getDraw = function () {
    return new Draw();
  };

  this.getKeyboard = function () {
    return new Keyboard();
  };
}

module.exports = MainPage;
