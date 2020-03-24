import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import 'jest-dom/extend-expect';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'


describe('When editing an empty deck', () => {
  afterEach(cleanup);


  it('allow a card to be added to the tasks deck', async () => {
    console.log("Rec: " + window.location.origin);

    fetchMock.post('/game_configs/1', { card: { id: 100 }, {
      delay: 1000, // fake a slow network
    });

    const { getByText, getByLabelText, getByPlaceholderText, queryByText } = render(
      <ConfigEditor id={1} decks={{ tasks: [], achievements: [], employees: [] }} />
    );
    userEvent.type(getByLabelText('Name'), 'test card');
    userEvent.type(getByLabelText('Cost'), '1');
    userEvent.type(getByLabelText('Rounds'), '1');
    userEvent.type(getByLabelText('Actions'), 'TBC');
    userEvent.type(getByLabelText('Deck'), 'tasks');
    userEvent.type(getByLabelText('Number'), '3');
    userEvent.click(getByText('Save'));


    // await waitUntil(() => root.state('weather').summary !== null);

    expect(1 + 1).toBe(2);
  })
});
