'use strict';

(function () {

  /* @ngInject */
  function MainController(Game) {
    this.game = new Game();
  }

  angular
    .module('hangmanAppInternal')
    .controller('MainController', MainController);

})();
