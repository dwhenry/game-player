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
        elem = render(<ConfigEditor id={1} cards={[]}/>);
        fillInDeck(userEvent, elem)
      });

      await waitFor(() => expect(elem.getByText('(1) Apples').text).toEqual('(1) Apples'));
    })
  });

  describe('and deck is not empty', () => {
    it('inserts the card into the correct order at the front of the deck', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} cards={
          [{id: '101', name: 'Bananas', number: '2', deck: 'tasks'}]
        }/>);

        saveWithValues(elem)
      });

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (Apples|Bananas)/);

      expect(items.map((i) => i.text)).toEqual(['(1) Apples', '(2) Bananas']);
    });

    it('inserts the card into the correct order at the front of the deck', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} cards={
          [{id: '101', name: 'An Apple', number: '2', deck: 'tasks'}]
        }/>);
        saveWithValues(elem)
      });

      await elem.findByText(/\(1\) Apples/);

      const items = await elem.findAllByText(/\(\d\) (An )?Apples?/);

      expect(items.map((i) => i.text)).toEqual(['(2) An Apple', '(1) Apples']);
    });

    it('Can edit an existing card', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} cards={
          [{
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
          }]
        }/>);
      });

      const card = await elem.findByText(/\(\d\) Pears/);

      fireEvent.click(card);

      act(() => {
        saveWithValues(elem)
      });

      await elem.findByText(/\(1\) Apples/);

      expect(screen.getByTestId('all-decks').textContent).toEqual(
        '(2) tasks Add Card(1) Apples - Clone(2) Bananas - Clone(0) achievements Add Card(0) employees Add Card'
      )
    });

    it('Editing a card blocks selecting a different card to edit', async () => {
      act(() => {
        elem = render(<ConfigEditor id={1} cards={
          [{
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
          }]
        }/>);
      });

      const card = await elem.findByText(/\(3\) Pears/);

      fireEvent.click(card);

      await act(async () => {
        await userEvent.type(elem.getByLabelText('Name'), 'New name for card');
      });


      jest.spyOn(window, 'alert').mockImplementation(() => {
      });

      const newCard = await elem.findByText(/\(2\) Banana/);

      fireEvent.click(newCard);

      expect(window.alert).toHaveBeenCalledWith('Unable to Change card as pending edits exist')

      const cancelEdit = await elem.findByText(/Cancel/);

      fireEvent.click(cancelEdit);

      fireEvent.click(newCard);

      await expect(elem.getByLabelText('Name').value).toEqual('Bananas')
    });
  });

  it('Can change the deck on a existing card', async () => {
    act(() => {
      elem = render(<ConfigEditor id={1} cards={
        [{
          id: '100',
          name: 'Apples',
          number: '1',
          deck: 'tasks',
          cost: '1G',
          rounds: '0',
          actions: "Action 1\nAction2"
        }]
      }/>);
    });

    const card = await elem.findByText('(1) Apples');

    fireEvent.click(card);

    act(() => {
      saveWithValues(elem, {deck: 'employees', number: '2'})
    });

    await elem.findByText(/\(2\) Apples/);

    expect(screen.getByTestId('all-decks').textContent).toEqual(
      '(0) tasks Add Card(0) achievements Add Card(1) employees Add Card(2) Apples - Clone'
    )
  });

  async function fillInDeck(userEvent, elem) {
    let card = {
      name : 'Apples',
      cost : '1G',
      actions : 'TBC',
      deck : 'tasks',
      number : '1',
      rounds : '2'
    };
    let cardWithID = {...card, id: '101'};

    fetchMock.patch({url: '/game_configs/1', body: { card: card }}, {card: cardWithID}, {
      delay: 10, // fake a slow network
    });

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
