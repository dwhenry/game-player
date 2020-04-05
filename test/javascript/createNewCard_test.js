import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'

describe('When editing an empty deck', () => {
  afterEach(cleanup);

  it('allow a card to be added to the tasks deck', async () => {
    fetchMock.patch('/game_configs/1', { card: { id: '100', name: 'Apples', number: '1', deck: 'tasks' }, }, {
      delay: 10, // fake a slow network
    });

    let container = document.createElement('div');
    let elem;
    act(() => {
      elem = render(<ConfigEditor id={1} decks={{ tasks: [], achievements: [], employees: [] }} />);

      userEvent.type(elem.getByLabelText('Name'), 'test card');
      userEvent.type(elem.getByLabelText('Cost'), '1');
      userEvent.type(elem.getByLabelText('Rounds'), '1');
      userEvent.type(elem.getByLabelText('Actions'), 'TBC');
      userEvent.type(elem.getByLabelText('Deck'), 'tasks');
      userEvent.type(elem.getByLabelText('Number'), '3');
      userEvent.click(elem.getByText('Save'));
    })

    let a = await waitFor(() => expect(elem.getByText('(1) Apples').text).toMatch('(1) Apples'));
  })
});
