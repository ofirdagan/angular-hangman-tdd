'use strict';

function Keyboard() {
  this.element = $('keyboard');

  this.getKey = function (letter) {
    var index = letter.charCodeAt() - 'a'.charCodeAt();
    return $$('.key').get(index);
  };
}

module.exports = Keyboard;
