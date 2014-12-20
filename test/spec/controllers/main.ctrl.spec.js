'use strict';

describe('Controller: MainController', function () {
  var hangmanApi, wordBank, mainController, scope, Game;
  var maxStrikes = 5;
  // load the controller's module

  // Initialize the controller and a mock scope
  function aMainController() {
    var ctrl;
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('MainController', {
        $scope: scope,
        hangmanApi: hangmanApi,
        wordBank: wordBank,
        maxStrikes: maxStrikes,
        Game: Game
      });
    });
    return ctrl;
  }

  beforeEach(function () {
    module('hangmanTestKit');
    module('hangmanConstants');
    module('hangmanAppInternal');
    inject(function (hangmanApiMock, wordBankMock, GameMock) {
      hangmanApi = hangmanApiMock;
      wordBank = wordBankMock;
      Game = GameMock;
    });
    mainController = aMainController();
  });

  it('should have game\'s max strikes', inject(function () {
    expect(mainController.maxStrikes).toBe(maxStrikes);
  }));

  it('should show overlay when game over', inject(function (gameState, $rootScope) {
    spyOn($rootScope, 'toggle').andCallThrough();
    hangmanApi.getCategories.returns(['famousCats']);
    wordBank.getNextWord.whenCalledWithArgs('famousCats').returns('tom');

    mainController.game.state = gameState.lost;
    scope.$digest();

    expect($rootScope.toggle).toHaveBeenCalledWith('gameOverOverlay', 'on');
  }));

  it('should have first category as the default selected category', inject(function () {
    expect(mainController.category).toBe('');

    hangmanApi.getCategories.returns(['cookie', 'moshe']);

    expect(mainController.category).toBe('cookie');
  }));

  it('should have categories list', inject(function () {
    var categories = ['famousCats', 'moshe'];
    hangmanApi.getCategories.returns(categories);
    expect(mainController.categories).toEqual(categories);
  }));

  it('should create a new game with the next word', inject(function () {
    hangmanApi.getCategories.returns(['famousCats']);

    wordBank.getNextWord.whenCalledWithArgs('famousCats').returns('tom');

    expect(mainController.game).toBeDefined();
    expect(Game).toHaveBeenCalledWith('tom');
  }));

  it('should create a new game on category change', inject(function () {
    mainController.onCategoryChanged();
    expect(wordBank.getNextWord).toHaveBeenCalledOnce();
  }));

  it('should call selectLetter on letterSelected event', inject(function (hangmanEvents) {
    hangmanApi.getCategories.returns(['famousCats']);

    wordBank.getNextWord.whenCalledWithArgs('famousCats').returns('tom');
    scope.$broadcast(hangmanEvents.letterSelected, 'a');

    expect(mainController.game.selectLetter).toHaveBeenCalledWith('a');
  }));

});
