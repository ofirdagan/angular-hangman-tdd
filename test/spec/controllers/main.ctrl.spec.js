'use strict';

describe('Controller: MainController', function () {

  // load the controller's module
  beforeEach(function () {
    module('hangmanAppInternal');

    //add your mocks here
  });

  var MainController, scope;

  // Initialize the controller and a mock scope
  function aController() {
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      MainController = $controller('MainController', {
        $scope: scope
      });
    });
  }

  it('should have an instance of a game', inject(function (Game) {
    aController();
    expect(MainController.game instanceof Game).toBe(true);
  }));
});
