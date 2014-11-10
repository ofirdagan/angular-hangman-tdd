'use strict';

function MainPage() {
  this.navigate = function () {
    browser.get('/');
  };

  this.getTitle = function () {
    return $('h1').getText();
  };

  this.getCurrentCategory = function () {
    return $('.category').getText();
  };

  this.getCurrentStrikes = function () {
    return $('.strikes').getText();
  };

  this.getGuess = function () {
    return $$('letter .text').reduce(function (acc, letter) {
      return letter.getText().then(function (text) {
        return acc += text;
      });
    }, '');
  };

  this.getChar = function (char) {
    var index = char.charCodeAt() - 97;
    return $$('.char').get(index);
  };

}

module.exports = MainPage;
