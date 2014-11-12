'use strict';

describe('Controller: MainController', function () {

  // load the controller's module
  beforeEach(function () {
    module('hangmanAppInternal');
    module({
      hangmanApi: {
        getCategories: jasmine.createSpy('getCategories').andReturn({
          then: function (callback) {
            callback(['famousCats', 'countriesCapitals']);
          }
        })
      },
      wordBank: {
        getNextWord: jasmine.createSpy('getNextWord').andCallFake(function () {
          return {
            then: function (callback) {
              callback('Edge of Tomorrow');
            }
          };
        })
      }
    });
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

  it('should have game\'s max strikes', inject(function (maxStrikes) {
    aController();
    expect(MainController.maxStrikes).toBe(maxStrikes);
  }));

  it('should show overlay when game over', inject(function ($rootScope, gameState) {
    aController();
    $rootScope.$digest();
    expect(MainController.game.state).toBe(gameState.playing);
    spyOn($rootScope, 'toggle').andCallThrough();
    $rootScope.$digest();
    $rootScope.$broadcast('gameOver', gameState.lost);
    $rootScope.$digest();
    expect($rootScope.toggle).toHaveBeenCalledWith('gameOverOverlay', 'on');
  }));

  it('should have first category as the default selected category', inject(function () {
    aController();
    expect(MainController.category).toBe('famousCats');
  }));

  it('should get next word from the wordBank', inject(function (wordBank) {
    aController();
    expect(wordBank.getNextWord).toHaveBeenCalled();
  }));

  it('should get categories list from api service', inject(function (hangmanApi) {
    aController();
    expect(hangmanApi.getCategories).toHaveBeenCalled();
  }));

  it('should call getNext word on category change', inject(function (wordBank) {
    aController();
    expect(wordBank.getNextWord).toHaveBeenCalledOnce();

    MainController.onCategoryChanged();

    expect(wordBank.getNextWord.calls.length).toBe(2);
  }));

});
