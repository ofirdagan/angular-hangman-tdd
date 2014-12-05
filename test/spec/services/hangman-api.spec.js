'use strict';

describe('Service: hangmanApi', function () {

  var categoriesMock = ['countriesCapitals', 'cars', 'famousAustralians', 'movies'];
  var wordsListMock = {
    countriesCapitals: ['Jerusalem', 'Paris'],
    cars: ['BMW', 'OPEL', 'KIA'],
    famousAustralians: ['Crocodile Dandi'],
    movies: ['The Big Lebowski']
  };

  // load the service's module
  beforeEach(function () {
    module('hangmanAppInternal');
  });

  // instantiate service
  var hangmanApi, $httpBackend;
  beforeEach(inject(function (_hangmanApi_, _$httpBackend_) {
    hangmanApi = _hangmanApi_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get categories list from the server', inject(function () {
    $httpBackend.expectGET('_api/categories').respond(categoriesMock);
    var categories = [];

    hangmanApi.getCategories().then(function (categoriesRespond) {
      categories = categoriesRespond;
    });

    $httpBackend.flush();
    expect(categories).toEqual(categoriesMock);
  }));

  it('should get words by category list from the server', inject(function () {
    var someCategory = 'cars';
    $httpBackend.expectGET('_api/category/' + someCategory + '/words').respond(wordsListMock[someCategory]);
    var words = [];

    hangmanApi.getWordsInCategory(someCategory).then(function (wordsRespond) {
      words = wordsRespond;
    });

    $httpBackend.flush();
    expect(words).toEqual(wordsListMock[someCategory]);
  }));

});
