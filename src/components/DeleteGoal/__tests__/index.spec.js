import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import { Delete } from '../';
import { mount } from 'enzyme';

describe('Delete', () => {
  let testContext = {};

  beforeEach(() => {
    testContext = {};
    testContext.auth = { userId: 1, rememberToken: 'rememberToken' }
    testContext.deleteGoalMock = jest.fn()

    testContext.component = (
      <Delete
        auth={testContext.auth}
        deleteGoal={testContext.deleteGoalMock}
        goalId={1}
        loading={false}
        error={undefined}
        called={false}
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

  describe('deleting', () => {
    beforeEach(() => {
      const wrapper = mount(testContext.component);
      wrapper.simulate('click');
    });

    it('calls the delete goal mock with the correct arguments', () => {
      expect(testContext.deleteGoalMock).toBeCalledWith({
        variables: { goalId: 1, auth: testContext.auth }
      });
    });
  });
});
