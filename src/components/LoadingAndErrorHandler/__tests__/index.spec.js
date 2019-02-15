import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import LoadingAndErrorHandler from '../';

describe('LoadingAndErrorHandler', () => {
  let testContext = {};

  beforeEach(() => {
    testContext = {};
    testContext.props = {
      children: 'foo',
      loading: false,
      error: undefined
    }
  });

  describe('not loading and no error', () => {
    beforeEach(() => {
      const renderer = new ShallowRenderer();
      testContext.result = renderer.render(<LoadingAndErrorHandler {...testContext.props} />);
    });

    it('renders the child component', () => {
      expect(testContext.result).toMatchSnapshot();
    });
  });

  describe('loading', () => {
    beforeEach(() => {
      const renderer = new ShallowRenderer();
      testContext.props.loading = true;
      testContext.result = renderer.render(<LoadingAndErrorHandler {...testContext.props} />);
    });

    it('renders the loading message', () => {
      expect(testContext.result).toMatchSnapshot();
    });
  });

  describe('error', () => {
    beforeEach(() => {
      const renderer = new ShallowRenderer();
      testContext.props.error = { message: 'foobar' }
      testContext.result = renderer.render(<LoadingAndErrorHandler {...testContext.props} />);
    });

    it('renders the loading message', () => {
      expect(testContext.result).toMatchSnapshot();
    });
  });
});
