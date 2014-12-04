'use strict';

describe('Controller: MainController', function () {

  // load the controller's module
  beforeEach(function () {
    module('hangmanAppInternal');
    module({
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

  function getQ() {
    var $q;
    inject(function (_$q_) {
      $q = _$q_;
    });
    return $q;
  }

  function getRootScope() {
    var $rootScope;
    inject(function (_$rootScope_) {
      $rootScope = _$rootScope_;
    });
    return $rootScope;
  }

  function aMockService() {
    var $q = getQ();
    var $rootScope = getRootScope();

    var defer = $q.defer();

    var getCategories = function () {
      return defer.promise;
    };

    getCategories.returns = function (value) {
      defer.resolve(value);
      $rootScope.$digest();
    };

    return {
      getCategories: getCategories
    };
  }

  // Initialize the controller and a mock scope
  function aController(hangmanApi) {
    var ctrl;
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('MainController', {
        $scope: scope,
        hangmanApi: hangmanApi
      });
    });
    return ctrl;
  }

  function getControllerWithCategories(categories) {
    categories = categories || ['famousCats', 'countriesCapitals'];
    var hangmanApi = aMockService();
    var mainController = aController(hangmanApi);
    hangmanApi.getCategories.returns(categories);
    return mainController;
  }

  it('should have an instance of a game', inject(function (Game) {
    var mainController = getControllerWithCategories();
    expect(mainController.game instanceof Game).toBe(true);
  }));

  it('should have game\'s max strikes', inject(function (maxStrikes) {
    var mainController = getControllerWithCategories();
    expect(mainController.maxStrikes).toBe(maxStrikes);
  }));

  it('should show overlay when game over', inject(function ($rootScope, gameState) {
    var mainController = getControllerWithCategories();
    expect(mainController.game.state).toBe(gameState.playing);
    spyOn($rootScope, 'toggle').andCallThrough();
    $rootScope.$digest();
    $rootScope.$broadcast('gameOver', gameState.lost);
    $rootScope.$digest();
    expect($rootScope.toggle).toHaveBeenCalledWith('gameOverOverlay', 'on');
  }));

  it('should have first category as the default selected category', inject(function () {
    var mainController = getControllerWithCategories(['famousCats', 'moshe']);
    expect(mainController.category).toBe('famousCats');
  }));

  it('should have categories list', inject(function () {
    var categories = ['famousCats', 'moshe'];
    var mainController = getControllerWithCategories(categories);
    expect(mainController.categories).toEqual(categories);
  }));

  it('should get next word from the wordBank', inject(function (wordBank) {
    getControllerWithCategories(['famousCats', 'moshe']);
    expect(wordBank.getNextWord).toHaveBeenCalled();
  }));

  it('should call getNext word on category change', inject(function (wordBank) {
    var mainController = getControllerWithCategories();
    expect(wordBank.getNextWord).toHaveBeenCalledOnce();

    mainController.onCategoryChanged();

    expect(wordBank.getNextWord.calls.length).toBe(2);
  }));

  it('should broadcast event on category change', inject(function (wordBank, $rootScope) {
    var mainController = getControllerWithCategories();
    var eventSpy = jasmine.createSpy('category change event spy');
    $rootScope.$on('categoryChanged', eventSpy);
    mainController.onCategoryChanged();
    expect(eventSpy).toHaveBeenCalled();
  }));

});
