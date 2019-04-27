import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs'

import { Button, Welcome } from '@storybook/react/demo';
import { Completion } from 'components/Completion';

import 'reset-css';
import 'index.css';

const Padding = props => (
  <div style={{ padding: 10 }}>
    {props.children}
  </div>
)

storiesOf('Completion', module)
  .addDecorator(withKnobs)
  .add('Base', () => (
    <Padding>
      <Completion
        loading={boolean('loading', false)}
        error={boolean('error', false)}
        onClick={() => {}}
        checked={boolean('checked', true)}
        button={boolean('button', false)}
      />
    </Padding>
  ));
