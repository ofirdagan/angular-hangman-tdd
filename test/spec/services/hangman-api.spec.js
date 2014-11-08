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
    hangmanApi.getCategories().then(function (categories) {
      expect(categories).toEqual(categoriesMock);
    });
    $httpBackend.flush();
  }));

  it('should get words by category list from the server', inject(function () {
    var someCategory = 'cars';
    $httpBackend.expectGET('_api/category/' + someCategory + '/words').respond(wordsListMock[someCategory]);
    hangmanApi.getWordsInCategory(someCategory).then(function (words) {
      expect(words).toEqual(wordsListMock[someCategory]);
    });
    $httpBackend.flush();
  }));

});
