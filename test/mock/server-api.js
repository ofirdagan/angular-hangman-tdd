'use strict';

angular.module('hangmanAppMocks', ['ngMockE2E'])
  .service('serverMockLogic', function () {
    var categories = ['movies', 'countriesCapitals', 'cars', 'famousAustralians'];
    var db = {
      countriesCapitals: ['Jerusalem', 'Paris'],
      cars: ['BMW', 'OPEL', 'KIA'],
      famousAustralians: ['Crocodile Dandi'],
      movies: ['Big', 'wonda']
    };
    this.getCategories = function () {
      return categories;
    };
    this.getWordsForCategory = function (category) {
      return db[category];
    };
  })
  .run(function ($httpBackend, serverMockLogic) {
    $httpBackend.whenGET(/_api\/categories/).respond(function () {
      console.log('get categories');
      return [200, serverMockLogic.getCategories()];
    });

    $httpBackend.whenGET(/_api\/category\/.*\/words/).respond(function (method, url) {
      console.log('get words for categories');
      var category = url.match(/category\/(.*)\//)[1];
      return [200, serverMockLogic.getWordsForCategory(category)];
    });

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
