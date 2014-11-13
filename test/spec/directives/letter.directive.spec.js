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

  function compile(letter) {
    scope.letterObj = {val: letter};
    element = angular.element('<letter value="letterObj"></letter>');
    element = $compile(element)(scope);
    scope.$digest();
  }

  it('should have a value on scope', inject(function () {
    compile('a');
    expect(element.isolateScope().letterObj).toEqual({val: 'a'});
  }));

  it('should show the right text', function () {
    compile('a');
    expect(element.text().replace(/(\r\n|\n|\r)/gm, '')).toEqual('_');

    element.isolateScope().isRevealed = true;
    scope.$digest();

    expect(element.text().replace(/(\r\n|\n|\r)/gm, '')).toEqual('a');
  });

  it('should not be revealed as default', inject(function () {
    compile('a');
    expect(element.isolateScope().isRevealed).toBe(false);
  }));

  it('should be revealed as when letter is a white space', inject(function () {
    compile(' ');
    expect(element.isolateScope().isWhiteSpace).toBe(true);
    expect(element.isolateScope().isRevealed).toBe(true);
  }));

  it('should add white-space class when value is white space', inject(function () {
    compile(' ');
    expect(element.find('.white-space').length).toBe(1);
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

  it('should ignore case', inject(function () {
    compile('a');

    scope.$broadcast('revealLetter', 'A');

    expect(element.isolateScope().isRevealed).toBe(true);
  }));

  it('should stay reveled case', inject(function () {
    compile('a');

    scope.$broadcast('revealLetter', 'a');
    expect(element.isolateScope().isRevealed).toBe(true);

    scope.$broadcast('revealLetter', 'b');
    expect(element.isolateScope().isRevealed).toBe(true);
  }));

  it('should reset reveal on game over', inject(function ($rootScope) {
    compile('a');
    scope.$broadcast('revealLetter', 'a');
    expect(element.isolateScope().isRevealed).toBe(true);

    $rootScope.$broadcast('gameOver');
    scope.$digest();
    expect(element.isolateScope().isRevealed).toBe(false);
  }));

});
