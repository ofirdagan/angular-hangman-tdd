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
    var ctrl;
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = MainController = $controller('MainController', {
        $scope: scope
      });
    });
    return ctrl;
  }

  it('should have an instance of a game', inject(function (Game) {
    MainController = aController();
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

  function fakeApi(hangmanApi) {
    hangmanApi.getCategories = function () {
      return {
        then: jasmine.createSpy()
      };
    };
  }

  it('should show overlay when game over', inject(function ($rootScope, gameState, hangmanApi) {
    fakeApi(hangmanApi);
    aController();
    expect(MainController.game.state).toBe(gameState.playing);
    spyOn($rootScope, 'toggle').andCallThrough();
    $rootScope.$digest();
    MainController.game.state = gameState.lost;
    $rootScope.$digest();
    expect($rootScope.toggle).toHaveBeenCalledWith('gameOverOverlay', 'on');
  }));

  it('should change word on category change', inject(function () {
    aController();
    var spy = jasmine.createSpy('set category');
    MainController.game.setCategory = spy;

    MainController.category = 'yoba';
    MainController.onCategoryChanged();

    expect(MainController.game.setCategory).toHaveBeenCalledWith('yoba');
  }));

  it('should set category when available from game', inject(function (hangmanApi) {
    fakeApi(hangmanApi);
    aController();

    MainController.game.category = undefined;
    scope.$digest();
    expect(MainController.category).not.toBeDefined();

    MainController.game.category = 'yoba';
    scope.$digest();
    expect(MainController.category).toBe('yoba');

  }));
});
