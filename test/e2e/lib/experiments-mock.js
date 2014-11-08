/**
 * Created by Ofir_Dagan on 8/11/14.
 */
'use strict';

beforeEach(function () {
  browser.addMockModule('experimentsMock', function () {
    angular.module('experimentsMock', []).run(function (wixAngular) {
      angular.copy({}, wixAngular.experiments);
    });
  });
  this.mockExperiments = function (experiments) {
    browser.addMockModule('experimentsMock', function () {
      angular.module('experimentsMock', []).run(function (wixAngular) {
        angular.copy(experiments, wixAngular.experiments);
      });
    });
  };
});

afterEach(function () {
  browser.removeMockModule('experimentsMock');
});
