'use strict';

function Draw() {
  var TOTAL_PATHS = 10;

  this.element = $('.svg-draw');

  this.getVisibleStrikes = function () {
    return this.element.$$('path.ng-hide').count().then(function (count) {
      return TOTAL_PATHS - count;
    });
  };
}

module.exports = Draw;
