import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import 'jest-dom/extend-expect';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'

describe('When editing an empty deck', () => {
  afterEach(cleanup);

  it('allow a card to be added to the tasks deck', async () => {
    fetchMock.patch('/game_configs/1', { card: { id: '100', name: 'Apples', number: '1', deck: 'tasks' }, }, {
      delay: 1000, // fake a slow network
    });

    const { getByText, getByLabelText } = render(
      <ConfigEditor id={1} decks={{ tasks: [], achievements: [], employees: [] }} />
    );
    userEvent.type(getByLabelText('Name'), 'test card');
    userEvent.type(getByLabelText('Cost'), '1');
    userEvent.type(getByLabelText('Rounds'), '1');
    userEvent.type(getByLabelText('Actions'), 'TBC');
    userEvent.type(getByLabelText('Deck'), 'tasks');
    userEvent.type(getByLabelText('Number'), '3');
    userEvent.click(getByText('Save'));
    fetchMock.flush()
console.log('fuck here')
    let a = await waitFor(() => expect(getByText('(1) test card')).toEqual('apples and pears'));
console.log('here')
debugger

    expect(1 + 1).toBe(2);
  })
});
