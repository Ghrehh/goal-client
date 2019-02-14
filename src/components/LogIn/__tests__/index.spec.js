import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import { mount } from 'enzyme';
import { LogIn } from '../';

describe('LogIn', () => {
  let testContext = {};

  beforeEach(() => {
    testContext = {};
    testContext.setAuthMock = jest.fn();
    testContext.createSessionMock = jest.fn();

    testContext.component = (
      <LogIn
        setAuth={testContext.setAuthMock}
        createSession={testContext.createSessionMock}
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
      wrapper.find('.password').instance().value = 'password';
      wrapper.find('button').simulate('click');
    });

    it('calls the create session mock with the correct arguments', () => {
      expect(testContext.createSessionMock).toBeCalledWith({
        variables: { name: 'name', password: 'password' }
      });
    });
  });

  describe('saving auth on successful log in', () => {
    beforeEach(() => {
      const wrapper = mount(testContext.component);

      wrapper.setProps({
        setAuth: testContext.setAuthMock,
        createSession: testContext.createSessionMock,
        loading: false,
        rememberToken: 'rememberToken',
        userId: 'userId',
        error: undefined
      })
    });

    it('calls the create session mock with the correct arguments', () => {
      expect(testContext.setAuthMock).toBeCalledWith({
        rememberToken: 'rememberToken',
        userId: 'userId'
      });
    });
  });
});
