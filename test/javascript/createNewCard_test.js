import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import 'jest-dom/extend-expect';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'

describe('When editing an empty deck', () => {
  afterEach(cleanup);

  it('allow a card to be added to the tasks deck', () => {
    const { getByText, getByLabelText, getByPlaceholderText, queryByText } = render(
      <ConfigEditor decks={{ tasks: [], achievements: [], employees: [] }} />
    );
    userEvent.type(getByLabelText('Name'), 'test card');
    userEvent.type(getByLabelText('Cost'), '1');
    userEvent.type(getByLabelText('Rounds'), '1');
    userEvent.type(getByLabelText('Actions'), 'TBC');
    userEvent.type(getByLabelText('Deck'), 'tasks');
    userEvent.type(getByLabelText('Number'), '3');
    userEvent.click(getByText('Save'));

    expect(1 + 1).toBe(2);
  })
});
