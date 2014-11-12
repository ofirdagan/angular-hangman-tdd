'use strict';

var Draw = require('../fragments/draw.js');

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

  this.getChar = function (char) {
    var index = char.charCodeAt() - 'a'.charCodeAt();
    return $$('.char').get(index);
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
}

module.exports = MainPage;
