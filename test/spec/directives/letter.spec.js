'use strict';

describe('Directive: letter', function () {

  // load the directive's module
  beforeEach(function () {
    module('hangmanAppInternal');
  });

  var element,
    scope, $compile;

  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  function compile(val) {
    element = angular.element('<letter value="' + val + '"></letter>');
    element = $compile(element)(scope);
    scope.$digest();
  }

  it('should have a value on scope', inject(function () {
    compile('a');
    expect(element.isolateScope().value).toBe('a');
  }));

  it('should not be revealed as default', inject(function () {
    compile('a');
    expect(element.isolateScope().isRevealed).toBe(false);
  }));

  it('should be revealed on revealLetter event with right value', inject(function () {
    compile('a');

    scope.$broadcast('revealLetter', 'a');

    expect(element.isolateScope().isRevealed).toBe(true);
  }));

  it('should not be revealed on revealLetter event with false value', inject(function () {
    compile('a');

    scope.$broadcast('revealLetter', 'b');

    expect(element.isolateScope().isRevealed).toBe(false);
  }));

});
