'use strict';

function GameOverModal() {

  this.element = $('.overlay-content');

  this.getText = function () {
    return this.element.$('.overlay-title').getText();
  };

  this.getOkButton = function () {
    return $('.play-again-btn');
  };
}

module.exports = GameOverModal;
