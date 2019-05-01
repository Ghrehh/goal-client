import combineClass from '../';

describe('combinedClass', () => {
  let testContext = {};

  beforeEach(() => {
    testContext = {};
  });

  describe('with no arguments', () => {
    beforeEach(() => {
      testContext.result = combineClass();
    });

    it('should return', () => {
      expect(testContext.result).toEqual('');
    });
  });

  describe('with one argument', () => {
    beforeEach(() => {
      testContext.result = combineClass('foo');
    });

    it('should return', () => {
      expect(testContext.result).toEqual('foo');
    });
  });

  describe('with many arguments', () => {
    beforeEach(() => {
      testContext.result = combineClass('foo', 'bar', 'baz');
    });

    it('should return', () => {
      expect(testContext.result).toEqual('foo bar baz');
    });
  });

  describe('with many arguments, some of which are undefined', () => {
    beforeEach(() => {
      testContext.result = combineClass('foo', undefined, 'baz');
    });

    it('should return', () => {
      expect(testContext.result).toEqual('foo baz');
    });
  });
});
