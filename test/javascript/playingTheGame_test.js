import React from 'react';
import fetchMock from 'fetch-mock';
import { render, act } from '@testing-library/react';
import GameBoardSetter from '../../app/javascript/components/GameBoardSetter'
import { events, pollEvents, getCards } from '../../app/javascript/state/CardState'

jest.useFakeTimers();

const initialBoardState = [
  "Tasks",            "Backlog: Hidden 3", "Discard: Spot", "Face up: Spot", "Face up: Spot",
  "Make me editable", "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot",
  "Player 2",         "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot"
];

describe('Playing the game', () => {
  let elem;
  let initialGameState;
  let mockDataTransfer;

  beforeEach(async (done) => {
    initialGameState = buildGameState();
    mockDataTransfer = MockDataTransfer();

    act(() => {
      elem = render(<GameBoardSetter {...initialGameState} />);
    });

    done()
  });

  it("Can load the game with cards in decks", async () => {
    matchPageState(initialBoardState);
  });

  it("Can move cards around", async () => {
    let ownershipPromiseResolver;
    let ownershipPromise = new Promise((resolve) => { ownershipPromiseResolver = resolve });

    let objectLocator = pickupCard(-1, ownershipPromise);

    // we resolve the promise immediately in this test case
    ownershipPromiseResolver({success: true});

    dropCard(
      objectLocator,
      { locationId: initialGameState.locations[0].id, stack: 'pile' },
      { locationId: initialGameState.locations[1].id, stack: 'hand' });

    // check the local view is up to date
    matchPageState([
      "Tasks",            "Backlog: Hidden 2", "Discard: Spot", "Face up: Spot", "Face up: Spot",
      "Make me editable", "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Hidden pending",
      "Player 2",         "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot"
    ]);

    await pollServerForUpdates(objectLocator);

    // check the page is fully updated
    matchPageState([
      "Tasks",            "Backlog: Hidden 2", "Discard: Spot", "Face up: Spot", "Face up: Spot",
      "Make me editable", "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Test Card",
      "Player 2",         "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot"
    ]);

    // check it updated the objectLocator on the card
    let playerCards = getCards(initialGameState.locations[1].id + '-hand')
    expect(playerCards[0].objectLocator).toMatch(/^card:/);
  });

  it("Can process other player card move events", async () => {
    let card = initialGameState.cards[0]
    let mockedEventResponse = {
      events: [{
        objectLocator: 'location:' + initialGameState.locations[0].id + ':stack:AAAA',
        eventType: 'move',
        order: 1,
        from: { locationId: initialGameState.locations[0].id, stack: 'pile' },
        to: { locationId: initialGameState.locations[2].id, stack: 'hand' },
        timestamp: new Date().getTime(),
        card: {
          id: card.id,
          deck: 'tasks',
          visible: 'face',
          stackId: initialGameState.locations[2].id + '-hand',
          objectLocator: 'card:' + nextUuid() + ':',
          name: 'Test Card'
        }
      }]
    };

    await pollServerForUpdates(null, mockedEventResponse);

    // check the page is fully updated
    matchPageState([
      "Tasks",            "Backlog: Hidden 2", "Discard: Spot", "Face up: Spot", "Face up: Spot",
      "Make me editable", "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot",
      "Player 2",         "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Test Card"
    ]);
  });

  it("Rejecting ownership before you drop the card should just ignore the card drop", async () => {
    let ownershipPromiseResolver;
    let ownershipPromise = new Promise((resolve) => { ownershipPromiseResolver = resolve });

    let objectLocator = pickupCard(-1, ownershipPromise)

    // we did get ownership this time around
    ownershipPromiseResolver({success: false});

    // we need to wait for all pormises to be resolved
    await new Promise(setImmediate)

    dropCard(
      objectLocator,
      { locationId: initialGameState.locations[0].id, stack: 'pile' },
      { locationId: initialGameState.locations[1].id, stack: 'hand' });

    // check the local view is up to date
    matchPageState(initialBoardState);

    // it should have a log somewhere.....
  });

  it("Rejecting ownership after you drop the card should revert any moves your have made", async () => {
    let ownershipPromiseResolver;
    let ownershipPromise = new Promise((resolve) => { ownershipPromiseResolver = resolve });

    let objectLocator = pickupCard(-1, ownershipPromise)

    dropCard(
      objectLocator,
      { locationId: initialGameState.locations[0].id, stack: 'pile' },
      { locationId: initialGameState.locations[1].id, stack: 'hand' });

    matchPageState([
      "Tasks",            "Backlog: Hidden 2", "Discard: Spot", "Face up: Spot", "Face up: Spot",
      "Make me editable", "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Hidden pending",
      "Player 2",         "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot"
    ]);

    // we did NOT get ownership this time around
    act(() => ownershipPromiseResolver({success: false}));

    // we need to wait for all pormises to be resolved
    await act(() => new Promise(setImmediate));

    // check the local view is up to date
    matchPageState(initialBoardState);

    // we should have a log of this somewhere....
  });

  it("Received an update from the polling from a different user while we have pending events on the same object invalidates our events", async () => {
    let ownershipPromiseResolver;
    let ownershipPromise = new Promise((resolve) => { ownershipPromiseResolver = resolve });

    let objectLocator = pickupCard(-1, ownershipPromise)

    dropCard(
      objectLocator,
      { locationId: initialGameState.locations[0].id, stack: 'pile' },
      { locationId: initialGameState.locations[1].id, stack: 'hand' });

    matchPageState([
      "Tasks",            "Backlog: Hidden 2", "Discard: Spot", "Face up: Spot", "Face up: Spot",
      "Make me editable", "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Hidden pending",
      "Player 2",         "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot"
    ]);

    let card = initialGameState.cards[0];
    let mockedEventResponse = {
      events: [{
        objectLocator: objectLocator,
        eventType: 'move',
        order: 1,
        from: { locationId: initialGameState.locations[0].id, stack: 'pile' },
        to: { locationId: initialGameState.locations[2].id, stack: 'hand' },
        timestamp: new Date().getTime(),
        card: {
          id: card.id,
          deck: 'tasks',
          visible: 'face',
          stackId: initialGameState.locations[2].id + '-hand',
          objectLocator: 'card:' + nextUuid() + ':',
          name: 'Test Card'
        }
      }]
    }

    await pollServerForUpdates(null, mockedEventResponse);

    // check the page is fully updated
    matchPageState([
      "Tasks",            "Backlog: Hidden 2", "Discard: Spot", "Face up: Spot", "Face up: Spot",
      "Make me editable", "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Spot",
      "Player 2",         "Backlog: Spot",     "Board: Spot",   "Face up: Spot", "Staff: Spot", "Hand: Test Card"
    ]);
    // This is now a NO-OP but we should still resolve events..
    // enabling this actually causes in with unwatching which I don't understand...
    // await ownershipPromiseResolver({success: false});

    // we need to wait for all pormises to be resolved
    // await new Promise(setImmediate)

    // we should have a log of this somewhere....


  });

  // lets ignore this for now and assume it won't happen...
  xit("Alerts when the game has lagged to much", () => {});

  // lets do this later...
  xit("Can edit your player name", () => {});

  const matchPageState = (expectedState) => {
    let actual = [...document.querySelectorAll('.player__title,.location__title,.stack__name,.card__type')].map(e => e.textContent);

    expect(actual).toEqual(expectedState)
  };

  const pollServerForUpdates = async (objectLocator, response) => {
    let lastUpdate = 0;
    let mockEventsResponse;

    if(response) {
      mockEventsResponse = response;
    } else {
      let realobjectLocator = objectLocator.replace(/:[^:]+$/, ':'); // drop position element for face down card stacks
      let card = initialGameState.cards.find(c => c.objectLocator === realobjectLocator)

      mockEventsResponse = {
        events: events(objectLocator).map((event) => {
          return {
            ...event,
            eventType: 'move',
            order: 1,
            card: {
              ...card,
              visible: 'face',
              stackId: event.to.locationId + '-' + event.to.stack,
              objectLocator: 'card:' + event.to.locationId + ':' + event.to.stack + ":" + card.id,
              name: 'Test Card',
            }
          }
        })
      }
    }


    fetchMock.get({url: '/games/' + initialGameState.id + '/events?since=' + lastUpdate }, mockEventsResponse);

    await act(pollEvents)
  };

  const pickupCard = (cardPos, ownershipPromise, objectLocator) => {
    if(cardPos < 0) cardPos = initialGameState.cards.length + cardPos;
    const card = initialGameState.cards[cardPos];
    if(!objectLocator) {
      let cards = getCards(card.stackId);
      objectLocator = cards[cards.length - 1].objectLocator;
    }

    let startingNode = document.querySelector(".card-" + card.id);

    fetchMock.post({url: '/games/' + initialGameState.id + '/cards/' + objectLocator + '/take'}, ownershipPromise);

    startingNode.dispatchEvent(
      createBubbledEvent("dragstart", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 0 })
    );

    return objectLocator;
  };
  const dropCard = (objectLocator, fromStack, toStack) => {
    let endingNode = elem.getByTestId(toStack.locationId + '-' + toStack.stack);

    let mockDropEvent = {
      event: 'cardMove',
      data: {
        // timestamp: new Date().getTime(), // as we can't get the same value that will be set in the code for this wwe will instead use partial matching
        objectLocator: objectLocator,
        from: fromStack,
        to: toStack,
      }
    };

    // mock the event move call to the backend
    fetchMock.patch({url: '/games/' + initialGameState.id + '/cards/' + objectLocator + '/move', matchPartialBody: true, body: mockDropEvent}, {}, {
      delay: 10, // fake a slow network
    });

    endingNode.dispatchEvent(
      createBubbledEvent("drop", { dataTransfer: mockDataTransfer, clientX: 0, clientY: 1 })
    );
  };

  const MockDataTransfer = () => {
    let data = {}
    data.setData = (key, value) => {
      data[key] = value;
    };
    data.getData = (key) => {
      return data[key];
    };
    return data;
  };

  function createBubbledEvent(type, props = {}){
    const event = new Event(type, { bubbles: true });
    Object.assign(event, props);
    return event;
  }

  function buildGameState() {
    let player1Id = nextUuid();
    let player2Id = nextUuid();
    return {
      skipPolling: true,
      id: nextUuid(),
      name: "Test 123",
      game_config_id: 'Config-111',
      lastEventId: 0,
      cards: [
        {
          id: nextUuid(),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectLocator: 'location:tasks:pile:',
        },
        {
          id: nextUuid(),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectLocator: 'location:tasks:pile:',
        },
        {
          id: nextUuid(),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectLocator: 'location:tasks:pile:',
        }
      ],
      locations: [
        { id: 'tasks', name: 'Tasks', type: 'deck' },
        { id: player1Id, name: "Make me editable", type: 'player' },
        { id: player2Id, name: "Player 2", type: 'player' },
      ],
      stacks: {
        deck: [['Backlog', 'pile'], ['Discard', 'discard'], ['Face up', 'fu_cards']],
        player: [['Backlog', 'pile'], ['Board', 'board'], ['Face up', 'fu_cards'], ['Staff', 'employees'], ['Hand', 'hand']],
      },
      params: {
        tasks: { fu_cards: { min_cards: 2 } },
        [player1Id]: {cash: 0, energy: 0, sp: 0},
        [player2Id]: {cash: 0, energy: 0, sp: 0},
      }
    }
  }

  function nextUuid() {
    return 'UUID-' + Math.random().toString(36).substr(2, 9)
  }
});
