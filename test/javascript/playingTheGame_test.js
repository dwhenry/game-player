import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor, act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameBoard from '../../app/javascript/components/GameBoard'

describe('Playing the game', () => {
  let elem;
  let initialGameState;

  beforeEach(async (done) => {
    initialGameState = buildGameState();

    act(() => {
      elem = render(<GameBoard {...initialGameState} />);
    });

    await waitFor(() => expect(elem.getByTestId(initialGameState.next_action).text).not.toEqual(''));
    done()
  });

  it("Can load the game with cards in decks", async () => {
    let actual = [...document.querySelectorAll('.player__title,.location__title,.stack__name,.card__type')].map(e => e.textContent);
    let expected = [
      "Tasks",                    "Backlog", "Hidden: 10", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face Up", "None", "Staff", "None", "Hand", "None",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face Up", "None", "Staff", "None", "Hand", "None", ];

    // this is just a check of the location as no card are currently visible
    expect(actual).toEqual(expected)
  });


  const MockDataTransfer = () => {
    let data = {}
    data.setData = (key, value) => {
      data[key] = value;
    }
    data.getData = (key) => {
      return data[key];
    }
    return data;
  };


  xit("Can edit your player name", () => {});
  it("Can move cards around", async () => {
    const cardId = initialGameState.locations[0].pile.cards[0].id;
    const player1Id = initialGameState.players[0].id;
    
    let startingNode = document.querySelector(".card-" + cardId);
    let endingNode = document.querySelector(".player-" + player1Id + " .stack-hand");
    
    // console.log(".player-" + player1Id + " .stack-hand");
    // console.log(endingNode);

    // await elem.findByText(/help me you stupid thing/)
    // .player-UUID-833c9lr32 .stack-hand
    let data = {
      task: 'cardMove', 
      action_id: initialGameState.next_action, 
      card: {id: cardId, location: player1Id, stack: 'hand'}
    };

  console.log(data)
    fetchMock.patch({url: '/games/' + initialGameState.id, body: data}, {}, {
      delay: 10, // fake a slow network
    });

    let mockDataTransfer = MockDataTransfer();

    startingNode.dispatchEvent(
      createBubbledEvent("dragstart", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 0 })
    );
    endingNode.dispatchEvent(
      createBubbledEvent("drop", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 1 })
    );


  }); 
  xit("Can process other player card move events", () => {});
  xit("Can regect your card move if it has a conflict on the server", () => {});
  xit("Alerts when the game has lagged to much", () => {});

  function createBubbledEvent(type, props = {}){
    const event = new Event(type, { bubbles: true });
    Object.assign(event, props);
    return event;
  };

  function buildGameState() {
    return {
      id: nextUuid(),
      name: "Test 123",
      game_config_id: 'Config-111',
      locations: [
        {
          id: nextUuid(),
          name: 'Tasks',
          deck: 'tasks',
          pile: {
            key: "deck-task-pile",
            cards: [{id: nextUuid(), deck: 'tasks', visible: 'back'}],
            count: 10
          },
          discard: {
            key: "deck-tasks-discard", cards: [{id: nextUuid(), visible: 'slot'}], count: 0
          },
          fu_cards: {
            key: "deck-tasks-fu", cards: [{id: nextUuid(), visible: 'slot'}, {id: nextUuid(), visible: 'slot'}] },
        }
      ],
      players: [
        {
          status: "starting",
          id: nextUuid(),
          name: "Make me editable",
          tokens: {cash: 0, energy: 0, sp: 0},
          employees: [{id: nextUuid(), visible: 'slot'}],
          backlog: [{id: nextUuid(), visible: 'slot'}],
          hand: [{id: nextUuid(), visible: 'slot'}],
          fu_cards: [{id: nextUuid(), visible: 'slot'}],
          board: [{id: nextUuid(), visible: 'slot'}],
        },
        {
          status: "starting",
          id: nextUuid(),
          name: "Player 2",
          tokens: {cash: 0, energy: 0, sp: 0},
          employees: [{id: nextUuid(), visible: 'slot'}],
          backlog: [{id: nextUuid(), visible: 'slot'}],
          hand: [{id: nextUuid(), visible: 'slot'}],
          fu_cards: [{id: nextUuid(), visible: 'slot'}],
          board: [{id: nextUuid(), visible: 'slot'}],
        },
      ],
      log: ['......', '.......'],
      next_action: 'debs'
    }
  }

  function nextUuid() {
    return 'UUID-' + Math.random().toString(36).substr(2, 9)
  }
});
