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

  it('should have game\'s abc', inject(function () {
    aController();
    expect(MainController.abc).toBe(MainController.game.abc);
  }));

  it('should have game\'s max strikes', inject(function (maxStrikes) {
    aController();
    expect(MainController.maxStrikes).toBe(maxStrikes);
  }));

  it('should show overlay when game over', inject(function ($rootScope, gameState, hangmanApi) {
    hangmanApi.getCategories = function () {
      return {
        then: jasmine.createSpy()
      };
    };
    aController();
    expect(MainController.game.state).toBe(gameState.playing);
    spyOn($rootScope, 'toggle').andCallThrough();
    $rootScope.$digest();
    MainController.game.state = gameState.lost;
    $rootScope.$digest();
    expect($rootScope.toggle).toHaveBeenCalledWith('gameOverOverlay', 'on');
  }));

});
