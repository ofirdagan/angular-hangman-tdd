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
  });

  var scope;

  // Initialize the controller and a mock scope
  function aController() {
    var ctrl;
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('MainController', {
        $scope: scope
      });
    });
    return ctrl;
  }

  it('should have an instance of a game', inject(function (Game) {
    var mainController = aController();
    expect(mainController.game instanceof Game).toBe(true);
  }));

  it('should have game\'s max strikes', inject(function (maxStrikes) {
    var mainController = aController();
    expect(mainController.maxStrikes).toBe(maxStrikes);
  }));

  it('should show overlay when game over', inject(function ($rootScope, gameState) {
    var mainController = aController();
    $rootScope.$digest();
    expect(mainController.game.state).toBe(gameState.playing);
    spyOn($rootScope, 'toggle').andCallThrough();
    $rootScope.$digest();
    $rootScope.$broadcast('gameOver', gameState.lost);
    $rootScope.$digest();
    expect($rootScope.toggle).toHaveBeenCalledWith('gameOverOverlay', 'on');
  }));

  it('should have first category as the default selected category', inject(function () {
    var mainController = aController();
    expect(mainController.category).toBe('famousCats');
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
    var mainController = aController();
    expect(wordBank.getNextWord).toHaveBeenCalledOnce();

    mainController.onCategoryChanged();

    expect(wordBank.getNextWord.calls.length).toBe(2);
  }));

  it('should broadcast event on category change', inject(function (wordBank, $rootScope) {
    var mainController = aController();
    var eventSpy = jasmine.createSpy('category change event spy');
    $rootScope.$on('categoryChanged', eventSpy);
    mainController.onCategoryChanged();
    expect(eventSpy).toHaveBeenCalled();
  }));

});
