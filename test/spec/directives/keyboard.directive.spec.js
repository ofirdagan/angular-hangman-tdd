'use strict';

describe('Directive: keyboard', function () {

  var element;
  var scope;

  // load the directive's module
  beforeEach(function () {
    module('hangmanConstants');
    module('hangmanAppInternal');
    inject(function ($rootScope) {
      scope = $rootScope.$new();
    });
  });

  it('should hold keys', inject(function () {
    scope.keys = ['a', 'b', 'c', 'd'];  // usually goes till z..
    compile('<keyboard keys="keys"></keyboard>');

    expect(element.isolateScope().keys).toBe(scope.keys);
  }));

  it('should emit letterSelected event on key click', function () {
    //given
    scope.keys = ['a', 'b', 'c', 'd'];  // usually goes till z..
    compile('<keyboard keys="keys"></keyboard>');

    var eventSpy = jasmine.createSpy('event spy');
    scope.$on('letterSelected', eventSpy);

    //when
    element.isolateScope().onKeyClick('a');

    //then
    expect(eventSpy).toHaveBeenCalledWith(jasmine.any(Object), 'a');
  });

  it('should add class was-selected when wasSelected returns true', function () {
    //given
    scope.keys = ['a', 'b', 'c', 'd'];  // usually goes till z..
    scope.wasSelected = function (key) {
      return key === 'a';
    };
    compile('<keyboard keys="keys" was-selected="wasSelected"></keyboard>');

    //when
    scope.$digest();

    //then
    var letterA = element.find('.key')[0];
    expect(letterA).toHaveClass('was-selected');

    var letterB = element.find('.key')[1];
    expect(letterB).not.toHaveClass('was-selected');

    expect(element.find('.was-selected').length).toBe(1);
  });

  function compile(template) {
    inject(function ($rootScope, $compile) {
      element = angular.element(template);
      element = $compile(element)(scope);
    });
    scope.$digest();
  }

});
