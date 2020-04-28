import React from 'react';
import fetchMock from 'fetch-mock';
import { render, cleanup, waitForElement, waitFor, act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameBoard from '../../app/javascript/components/GameBoard'
import { ResolvePlugin } from 'webpack';
import { events, pollEvents, getCards } from '../../app/javascript/state/CardState'

jest.useFakeTimers();

describe('Playing the game', () => {
  let elem;
  let initialGameState;
  let mockDataTransfer;

  beforeEach(async (done) => {
    initialGameState = buildGameState();
    mockDataTransfer = MockDataTransfer();

    act(() => {
      elem = render(<GameBoard {...initialGameState} />);
    });

    done()
  });

  it("Can load the game with cards in decks", async () => {
    matchPageState([
      "Tasks",                    "Backlog", "Hidden: 10", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None", ]);
  });

  it("Can move cards around", async () => {
    let ownershipPromiseResolver;
    let ownershipPromise = new Promise((resolve) => { ownershipPromiseResolver = resolve });

    let objectId = pickupCard(0, ownershipPromise)

    // we resolve the promise immediately in this test case
    ownershipPromiseResolver({success: true, objectId: objectId});

    dropCard(
      objectId, 
      { locationId: initialGameState.locations[0].id, stack: 'pile' }, 
      { locationId: initialGameState.locations[1].id, stack: 'hand' });

    // check the local view is up to date
    matchPageState([
      "Tasks",                    "Backlog", "Hidden: 9", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "Hidden: pending",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None", ]);

    await pollServerForUpdates(objectId);

    // check the page is fully updated
    matchPageState([
      "Tasks",                    "Backlog", "Hidden: 9", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "Visible: Test Card",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None", ]);
  }); 

  it("Can process other player card move events", async () => {
    let card = initialGameState.cards[0]
    let mockedEventResponse = {
      events: [{
        objectId: getCards(card.stackId).find(c => c.id === card.id).objectId,
        from: { locationId: initialGameState.locations[0].id, stack: 'pile' },
        to: { locationId: initialGameState.locations[2].id, stack: 'hand' },
        timestamp: new Date().getTime(),
        card: {
          id: card.id,
          deck: 'tasks',
          visible: 'face',
          stackId: initialGameState.locations[2].id + '-hand',
          objectId: 'card:' + nextUuid() + ':',
          count: null,
          name: 'Test Card'
        }
      }]
    }

    await pollServerForUpdates(null, mockedEventResponse);

    // check the page is fully updated
    matchPageState([
      "Tasks",                    "Backlog", "Hidden: 9", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "Visible: Test Card", ]);
  });

  it("Rejecting ownership before you drop the card should just ignore the card drop", async () => {
    let ownershipPromiseResolver;
    let ownershipPromise = new Promise((resolve) => { ownershipPromiseResolver = resolve });

    let objectId = pickupCard(0, ownershipPromise)

    // we did get ownership this time around
    ownershipPromiseResolver({success: false, objectId: objectId});

    // we need to wait for all pormises to be resolved
    await new Promise(setImmediate)

    dropCard(
      objectId, 
      { locationId: initialGameState.locations[0].id, stack: 'pile' }, 
      { locationId: initialGameState.locations[1].id, stack: 'hand' });

    // check the local view is up to date
    matchPageState([
      "Tasks",                    "Backlog", "Hidden: 10", "Discard", "None", "Face up", "None", "None",
      "Player: Make me editable", "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None",
      "Player: Player 2",         "Backlog", "None",       "Board", "None", "Face up", "None", "Staff", "None", "Hand", "None", ]);

    // it should have a log somewhere.....
  });

  xit("Alerts when the game has lagged to much", () => {});
  xit("Can edit your player name", () => {});

  const matchPageState = (expectedState) => {
    let actual = [...document.querySelectorAll('.player__title,.location__title,.stack__name,.card__type')].map(e => e.textContent);

    expect(actual).toEqual(expectedState)
  }

  const pollServerForUpdates = async (objectId, response) => {
    let lastUpdate = 0;
    let mockEventsResponse;

    if(response) {
      mockEventsResponse = response;
    } else {
      let realObjectId = objectId.replace(/-[^-]+$/, ''); // drop position element for face down card stacks
      let card = initialGameState.cards.find(c => c.objectId === realObjectId)
  
      mockEventsResponse = {
        events: events(objectId).map((event) => {
          return {
            ...event, 
            card: {
              ...card, 
              visible: 'face', 
              stackId: event.to.locationId + '-' + event.to.stack, 
              objectId: 'card:' + card.id + ':' ,
              name: 'Test Card',
              count: null
            }
          }
        })
      }  
    }


    fetchMock.get({url: '/games/' + initialGameState.id + '/events', body: { since: lastUpdate }}, mockEventsResponse);

    await act(pollEvents)
  }

  const pickupCard = (cardPos, ownershipPromise) => {
    const card = initialGameState.cards[cardPos];
    let startingNode = document.querySelector(".card-" + card.id);
    let cards = getCards(card.stackId)
    let objectId = cards[cards.length - 1].objectId;

    fetchMock.post({url: '/games/' + initialGameState.id + '/ownership/' + objectId}, ownershipPromise);
    
    startingNode.dispatchEvent(
      createBubbledEvent("dragstart", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 0 })
    );

    return objectId;
  }
  const dropCard = (objectId, fromStack, toStack) => {
    let endingNode = elem.getByTestId(toStack.locationId + '-' + toStack.stack);

    let mockDropEvent = {
      event: 'cardMove', 
      data: {
        // timestamp: new Date().getTime(), // as we can't get the same value that will be set in the code for this wwe will instead use partial matching
        objectId: objectId,
        from: fromStack,
        to: toStack,
      }
    };

    // mock the event move call to the backend
    fetchMock.patch({url: '/games/' + initialGameState.id + '/ownership/' + objectId, matchPartialBody: true, body: mockDropEvent}, {}, {
      delay: 10, // fake a slow network
    });

    endingNode.dispatchEvent(
      createBubbledEvent("drop", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 1 })
    );
  }

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
        { 
          id: nextUuid(),
          deck: 'tasks',
          visible: 'back',
          stackId: taskLocationId + '-pile',
          objectId: 'location:tasks:pile',
          count: 10
        }
      ],
      locations: [
        {
          id: taskLocationId,
          name: 'Tasks',
          deck: 'tasks',
          type: 'deck',
        },
        {
          status: "starting",
          id: player1Id,
          name: "Make me editable",
          type: 'player',
        },
        {
          status: "starting",
          id: player2Id,
          name: "Player 2",
          type: 'player',
        },
      ],
      stacks: {
        deck: [['Backlog', 'pile'], ['Discard', 'discard'], ['Face up', 'fu_cards']],
        player: [['Backlog', 'pile'], ['Board', 'board'], ['Face up', 'fu_cards'], ['Staff', 'employees'], ['Hand', 'hand']],
      },
      params: {
        [taskLocationId]: { fu_cards: { min_cards: 2 } },
        [player1Id]: {cash: 0, energy: 0, sp: 0},
        [player2Id]: {cash: 0, energy: 0, sp: 0},
      }
    }
  }

  function nextUuid() {
    return 'UUID-' + Math.random().toString(36).substr(2, 9)
  }
});
