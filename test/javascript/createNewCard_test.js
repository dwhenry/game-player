import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'

describe('When adding cards to a deck', () => {
  beforeAll(() => {
    fetchMock.patch('/game_configs/1', {card: {id: '100', name: 'Apples', number: '1', deck: 'tasks'},}, {
      delay: 10, // fake a slow network
    });
  })
  afterEach(cleanup);

  describe('and deck is empty', () => {
    it('allow a card to be added to the tasks deck', async () => {

      let elem;
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{tasks: [], achievements: [], employees: []}}/>);

        fillInDeck(userEvent, elem)
      });

      await waitFor(() => expect(elem.getByText('(1) Apples').text).toEqual('(1) Apples'));
    })
  })

  describe('and deck is not empty', () => {
    it('inserts the card into the correct order at the front of the deck', async () => {
      let elem;
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{ tasks: [{ id: '101', name: 'Bananas', number: '2', deck: 'tasks' }], achievements: [], employees: [] }} />);

        fillInDeck(userEvent, elem)
      });

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (Apples|Bananas)/);

      expect(items.map((i) => i.text)).toEqual(['(1) Apples', '(2) Bananas']);
    })

    it('inserts the card into the correct order at the front of the deck', async () => {
      let elem;
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{ tasks: [{ id: '101', name: 'An Apple', number: '2', deck: 'tasks' }], achievements: [], employees: [] }} />);
        fillInDeck(userEvent, elem)
      });

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (An )?Apples?/);

      expect(items.map((i) => i.text)).toEqual(['(2) An Apple', '(1) Apples']);
    })

  })

  function fillInDeck(userEvent, elem) {
    userEvent.type(elem.getByLabelText('Name'), 'Apples');
    userEvent.type(elem.getByLabelText('Cost'), '1');
    userEvent.type(elem.getByLabelText('Rounds'), '1');
    userEvent.type(elem.getByLabelText('Actions'), 'TBC');
    userEvent.type(elem.getByLabelText('Deck'), 'tasks');
    userEvent.type(elem.getByLabelText('Number'), '3');
    userEvent.click(elem.getByText('Save'));
  }
});
