import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import ConfirmationModal from 'components/modals/Confirmation';
import { Delete } from '../';
import { shallow, mount } from 'enzyme';

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

  describe('clicking the delete button', () => {
    beforeEach(() => {
      testContext.wrapper = mount(testContext.component);
      testContext.wrapper.simulate('click');
    });

    it('renders the delete confirmation modal', () => {
      expect(testContext.wrapper.find(ConfirmationModal).length).toEqual(1);
    });
  });

  describe('confirmation modal', () => {
    beforeEach(() => {
      testContext.wrapper = mount(testContext.component);
      testContext.wrapper.setState({ modalOpen: true });
    });

    describe('confirm', () => {
      beforeEach(() => {
        testContext.wrapper.find(ConfirmationModal).props().onConfirm()
      });

      it('calls the delete goal mock with the correct arguments', () => {
        expect(testContext.deleteGoalMock).toBeCalledWith({
          variables: { goalId: 1, auth: testContext.auth }
        });
      });
    });

    describe('cancel', () => {
      beforeEach(() => {
        testContext.wrapper.find(ConfirmationModal).props().onCancel()
      });

      it('closes the confirmation modal', () => {
        expect(testContext.wrapper.state().modalOpen).toEqual(false);
      });
    });
  });
});
