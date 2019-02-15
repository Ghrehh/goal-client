import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import { mount } from 'enzyme';
import { CreateGoal } from '../';

describe('CreateGoal', () => {
  let testContext = {};

  beforeEach(() => {
    testContext = {};
    testContext.auth = { userId: 1, rememberToken: 'rememberToken' }
    testContext.createGoalMock = jest.fn();

    testContext.component = (
      <CreateGoal
        createGoal={testContext.createGoalMock}
        auth={testContext.auth}
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

  describe('submitting form', () => {
    beforeEach(() => {
      const wrapper = mount(testContext.component);
      wrapper.find('.name').instance().value = 'name';
      wrapper.find('button').simulate('click');
    });

    it('calls the create session mock with the correct arguments', () => {
      expect(testContext.createGoalMock).toBeCalledWith({
        variables: { goalName: 'name', auth: testContext.auth }
      });
    });
  });
});
