'use strict';

describe('Controller: MainController', function () {

  // load the controller's module
  beforeEach(function () {
    module('testUtils');
    module('hangmanAppInternal');
  });

  var scope;

  // Initialize the controller and a mock scope
  function aController(hangmanApi, wordBank) {
    var ctrl;
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('MainController', {
        $scope: scope,
        hangmanApi: hangmanApi,
        wordBank: wordBank
      });
    });
    return ctrl;
  }

  function getTestUtils() {
    var testUtils;
    inject(function (_testUtils_) {
      testUtils = _testUtils_;
    });
    return testUtils;
  }

  function getControllerWithCategoriesAndWord(categories, word) {
    var testUtils = getTestUtils();
    categories = categories || ['famousCats', 'countriesCapitals'];
    word = word || 'Edge of tomorrow';

    var hangmanApi = testUtils.aHangmanApi();
    var wordBank = testUtils.aWordBank();

    var mainController = aController(hangmanApi, wordBank);
    hangmanApi.getCategories.returns(categories);
    wordBank.getNextWord.returns(word);
    return mainController;
  }

  it('should have an instance of a game', inject(function (Game) {
    var mainController = getControllerWithCategoriesAndWord();
    expect(mainController.game instanceof Game).toBe(true);
  }));

  it('should have game\'s max strikes', inject(function (maxStrikes) {
    var mainController = getControllerWithCategoriesAndWord();
    expect(mainController.maxStrikes).toBe(maxStrikes);
  }));

  it('should show overlay when game over', inject(function ($rootScope, gameState) {
    var mainController = getControllerWithCategoriesAndWord();
    expect(mainController.game.state).toBe(gameState.playing);
    spyOn($rootScope, 'toggle').andCallThrough();
    $rootScope.$digest();
    $rootScope.$broadcast('gameOver', gameState.lost);
    $rootScope.$digest();
    expect($rootScope.toggle).toHaveBeenCalledWith('gameOverOverlay', 'on');
  }));

  it('should have first category as the default selected category', inject(function () {
    var mainController = getControllerWithCategoriesAndWord(['famousCats', 'moshe']);
    expect(mainController.category).toBe('famousCats');
  }));

  it('should have categories list', inject(function () {
    var categories = ['famousCats', 'moshe'];
    var mainController = getControllerWithCategoriesAndWord(categories);
    expect(mainController.categories).toEqual(categories);
  }));

  it('should create a new game with the next word', inject(function () {
    var mainController = getControllerWithCategoriesAndWord(['famousCats', 'moshe'], 'bla');
    expect(mainController.game.getPhrase()).toEqual([{ val: 'b' }, { val: 'l' }, { val: 'a' }]);
  }));

  it('should create a new game on category change', inject(function () {
    var testUtils = getTestUtils();
    var wordBank = testUtils.aWordBank();
    var hangmanApi = testUtils.aHangmanApi();

    var mainController = aController(hangmanApi, wordBank);
    hangmanApi.getCategories.returns(['']);
    wordBank.getNextWord.returns('');

    expect(wordBank.getNextWord).toHaveBeenCalledOnce();

    mainController.onCategoryChanged();

    expect(wordBank.getNextWord.calls.length).toBe(2);
  }));

  it('should broadcast event on category change', inject(function (wordBank, $rootScope) {
    var mainController = getControllerWithCategoriesAndWord();
    var eventSpy = jasmine.createSpy('category change event spy');
    $rootScope.$on('categoryChanged', eventSpy);
    mainController.onCategoryChanged();
    expect(eventSpy).toHaveBeenCalled();
  }));

});
