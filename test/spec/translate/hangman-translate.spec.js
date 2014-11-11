'use strict';

describe('Hangman translate module', function () {

  // load the controller's module
  beforeEach(function () {
    module('hangmanTranslations');
  });

  it('should not explode while loading translate module', inject(function ($translate) {
    expect($translate).toBeDefined();
  }));
});
