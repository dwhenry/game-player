import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor, act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigEditor from '../../app/javascript/components/ConfigEditor'

describe('When adding cards to a deck', () => {
  let elem;

  beforeAll(() => {
    fetchMock.patch('/game_configs/1', {card: {id: '100', name: 'Apples', number: '1', deck: 'tasks'},}, {
      delay: 10, // fake a slow network
    });
  });
  afterEach(cleanup);

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

        fillInDeck(userEvent, elem)
      });

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (Apples|Bananas)/);

      expect(items.map((i) => i.text)).toEqual(['(1) Apples', '(2) Bananas']);
    });

    it('inserts the card into the correct order at the front of the deck', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} decks={{ tasks: [{ id: '101', name: 'An Apple', number: '2', deck: 'tasks' }], achievements: [], employees: [] }} />);
        fillInDeck(userEvent, elem)
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

        // const card = await elem.findByText(/\(\d\) An Apple/)

      });

      const card = await elem.findByText(/\(\d\) Pears/);

      fireEvent.click(card);
      await expect(elem.getByLabelText('ID').value).toEqual('100');
      await expect(elem.getByLabelText('Name').value).toEqual('Pears');
      await expect(elem.getByLabelText('Cost').value).toEqual('1G');
      await expect(elem.getByLabelText('Rounds').value).toEqual('0');
      await expect(elem.getByLabelText('Actions').value).toEqual("Action 1\nAction2");
      await expect(elem.getByLabelText('Deck').value).toEqual('tasks');
      await expect(elem.getByLabelText('Number').value).toEqual('3');

      act(() => {
        userEvent.type(elem.getByLabelText('Name'), 'Apples');
        userEvent.type(elem.getByLabelText('Number'), '1');
        userEvent.click(elem.getByText('Save'));
      })

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (Bananas|Apples)/);

      expect(items.map((i) => i.text)).toEqual(['(1) Apples', '(2) Bananas']);
    })
  });

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
