import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import App, { QUERY } from './App';

describe('Foo', () => {
  let testContext = {};
  const mocks = [
    {
      request: { query: QUERY },
      result: {
        data: {
          dog: { id: '1', title: 'Foo', body: 'Bar' },
        },
      },
    },
  ];

  beforeEach(() => {
    testContext = {};

    const component = (
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );
    testContext.renderer = new ShallowRenderer();
    testContext.renderer.render(component);
    testContext.result = testContext.renderer.getRenderOutput();
  });

  it('renders the component correctly', () => {
    expect(testContext.result).toMatchSnapshot();
  });
});
