import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor, act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameBoard from '../../app/javascript/components/GameBoard'
import { ResolvePlugin } from 'webpack';
import { events, pollEvents } from '../../app/javascript/state/CardState'

jest.useFakeTimers();

describe('Playing the game', () => {
  let elem;
  let initialGameState;

  beforeEach(async (done) => {
    initialGameState = buildGameState();

    act(() => {
      elem = render(<GameBoard {...initialGameState} />);
    });

    done()
  });

  it("Can load the game with cards in decks", async () => {
    let actual = [...document.querySelectorAll('.player__title,.location__title,.stack__name,.card__type')].map(e => e.textContent);
    let expected = [
      "Tasks",                    "Backlog", "Hidden: 10", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None", ];

    // this is just a check of the location as no card are currently visible
    expect(actual).toEqual(expected)
  });

  xit("Can edit your player name", () => {});
  it("Can move cards around", async () => {
    const cardId = initialGameState.cards[0].id;
    const player1Id = initialGameState.players[0].id;
    const taskId = initialGameState.locations[0].id;
    let startingNode = document.querySelector(".card-" + cardId);
    let endingNode = elem.getByTestId(player1Id + '-hand');

    // mock getting the object ownership
    let ownershipPromiseResolver;
    let ownershipPromise = new Promise((resolve) => { ownershipPromiseResolver = resolve });
    let objectId = initialGameState.cards[0].objectId + '-9';

    fetchMock.post({url: '/games/' + initialGameState.id + '/ownership/' + objectId}, ownershipPromise.then(() => ({success: true})));
    
    let mockDataTransfer = MockDataTransfer();

    startingNode.dispatchEvent(
      createBubbledEvent("dragstart", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 0 })
    );

    // we resolve the promise immediately in this test case
    ownershipPromiseResolver();

    let mockDropEvent = {
      event: 'cardMove', 
      data: {
        // timestamp: new Date().getTime(), // as we can't get the same value that will be set in the code for this wwe will instead use partial matching
        objectId: objectId,
        from: { locationId: taskId, stack: 'pile' },
        to: { locationId: player1Id, stack: 'hand' },
      }
    };

    // mock the event move call to the backend
    fetchMock.patch({url: '/games/' + initialGameState.id + '/ownership/' + objectId, matchPartialBody: true, body: mockDropEvent}, {}, {
      delay: 10, // fake a slow network
    });

    endingNode.dispatchEvent(
      createBubbledEvent("drop", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 1 })
    );

    // check the local view is up to date
    let actual = [...document.querySelectorAll('.player__title,.location__title,.stack__name,.card__type')].map(e => e.textContent);
    let expected = [
      "Tasks",                    "Backlog", "Hidden: 9", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "Hidden: pending",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None", ];

    // this is just a check of the location as no card are currently visible
    expect(actual).toEqual(expected)

    let lastUpdate = 0;
    let mockEventsResponse = {
      events: [
        { ...events(objectId)[0], card: {
          ...(initialGameState.cards[0]), 
          visible: 'face', 
          locationID: player1Id + '-hand', 
          objectId: 'card:' + cardId + ':' ,
          name: 'Test Card'
        } }
      ]
    }

    fetchMock.get({url: '/games/' + initialGameState.id + '/events', body: { since: lastUpdate }}, mockEventsResponse);

    // do the polling event
    jest.runOnlyPendingTimers();
    
    await act(pollEvents)

    // check the page is fully updated
    let actual2 = [...document.querySelectorAll('.player__title,.location__title,.stack__name,.card__type')].map(e => e.textContent);
    let expected2 = [
      "Tasks",                    "Backlog", "Hidden: 9", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "Visible: Test Card",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None", ];

    expect(actual2).toEqual(expected2)
  }); 

  xit("Can process other player card move events", () => {});
  xit("Can regect your card move if it has a conflict on the server", () => {});
  xit("Alerts when the game has lagged to much", () => {});

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

  function createBubbledEvent(type, props = {}){
    const event = new Event(type, { bubbles: true });
    Object.assign(event, props);
    return event;
  };

  function buildGameState() {
    let taskLocationId = nextUuid();
    let player1Id = nextUuid();
    let player2Id = nextUuid();
    return {
      id: nextUuid(),
      name: "Test 123",
      game_config_id: 'Config-111',
      cards: [
        { id: nextUuid(), deck: 'tasks', visible: 'back', stackId: taskLocationId + '-pile', objectId: 'location:tasks:pile', count: 10 }
      ],
      locations: [
        {
          id: taskLocationId,
          name: 'Tasks',
          deck: 'tasks',
        }
      ],
      location_stacks: [['Backlog', 'pile'], ['Discard', 'discard'], ['Face up', 'fu_cards']],
      location_params: {
        [taskLocationId]: {
          fu_cards: { min_cards: 2 },
        },
      },
      players: [
        {
          status: "starting",
          id: player1Id,
          name: "Make me editable",
        },
        {
          status: "starting",
          id: player2Id,
          name: "Player 2",
        },
      ],
      player_stacks: [['Backlog', 'pile'], ['Board', 'board'], ['Face up', 'fu_cards'], ['Staff', 'employees'], ['Hand', 'hand']],
      player_tokens: {
        [player1Id]: {cash: 0, energy: 0, sp: 0},
        [player2Id]: {cash: 0, energy: 0, sp: 0},
      }
    }
  }

  function nextUuid() {
    return 'UUID-' + Math.random().toString(36).substr(2, 9)
  }
});
