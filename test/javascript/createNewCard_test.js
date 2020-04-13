import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor, act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'

describe('When adding cards to a deck', () => {
  let elem;

  afterEach(cleanup);
  afterEach(fetchMock.reset);

  describe('and deck is empty', () => {
    it('allow a card to be added to the tasks deck', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{tasks: [], achievements: [], employees: []}}/>);
        fillInDeck(userEvent, elem)
      });

      await waitFor(() => expect(elem.getByText('(1) Apples').text).toEqual('(1) Apples'));
    })
  });

  describe('and deck is not empty', () => {
    it('inserts the card into the correct order at the front of the deck', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{ tasks: [{ id: '101', name: 'Bananas', number: '2', deck: 'tasks' }], achievements: [], employees: [] }} />);

        saveWithValues(elem)
      });

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (Apples|Bananas)/);

      expect(items.map((i) => i.text)).toEqual(['(1) Apples', '(2) Bananas']);
    });

    it('inserts the card into the correct order at the front of the deck', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{ tasks: [{ id: '101', name: 'An Apple', number: '2', deck: 'tasks' }], achievements: [], employees: [] }} />);
        saveWithValues(elem)
      });

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (An )?Apples?/);

      expect(items.map((i) => i.text)).toEqual(['(2) An Apple', '(1) Apples']);
    });

    it('Can edit an existing card', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{
          tasks: [{
            id: '101',
            name: 'Bananas',
            number: '2',
            deck: 'tasks',
            cost: '1G',
            rounds: '0',
            actions: "No Actions"
          }, {
            id: '100',
            name: 'Pears',
            number: '3',
            deck: 'tasks',
            cost: '1G',
            rounds: '0',
            actions: "Action 1\nAction2"
          }], achievements: [], employees: []
        }}/>);
      });

      const card = await elem.findByText(/\(\d\) Pears/);

      fireEvent.click(card);

      act(() => {
        saveWithValues(elem)
      })

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (Bananas|Apples)/);

      expect(items.map((i) => i.text)).toEqual(['(1) Apples', '(2) Bananas']);
    })
  });

  async function fillInDeck(userEvent, elem) {
    let card = {
      name : 'Apples',
      cost : '1G',
      actions : 'TBC',
      deck : 'tasks',
      number : '1',
      rounds : '2'
    }
    let cardWithID = {...card, id: '101'};

    fetchMock.patch({url: '/game_configs/1', body: { card: card }}, {card: cardWithID}, {
      delay: 10, // fake a slow network
    })

    await userEvent.type(elem.getByLabelText('Name'), card.name);
    await userEvent.type(elem.getByLabelText('Cost'), card.cost);
    await userEvent.type(elem.getByLabelText('Rounds'), card.rounds);
    await userEvent.type(elem.getByLabelText('Actions'), card.actions);
    await userEvent.type(elem.getByLabelText('Deck'), card.deck);
    await userEvent.type(elem.getByLabelText('Number'), card.number);

    userEvent.click(elem.getByText('Save'));
  }
  function saveWithValues(elem, card) {
    let cardWithDefaults = Object.assign(
      {id: '100', name: 'Apples', number: '1', deck: 'tasks'},
      card
    );
    fetchMock.patch('/game_configs/1', {card: cardWithDefaults}, {
      delay: 10, // fake a slow network
    });
    userEvent.click(elem.getByText('Save'));
  }
});
