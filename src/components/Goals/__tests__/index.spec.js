import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import { Goals } from '../';

describe('Goals', () => {
  let testContext = {};

  beforeEach(() => {
    testContext = {};

    testContext.component = (
      <Goals
        goals={[{ name: 'Goal', id: 1 }]}
        loading={false}
        error={undefined}
      />
    );
  });

  describe('snapshot', () => {
    beforeEach(() => {
      const renderer = new ShallowRenderer();
      testContext.result = renderer.render(testContext.component);
    });

    it('renders the component correctly', () => {
      expect(testContext.result).toMatchSnapshot();
    });
  });
});
