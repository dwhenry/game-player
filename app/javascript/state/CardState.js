import React from 'react';
import { takeEvent, getUpdates } from '../modules/utils'

let ownershipEvents = {};
let cardsByStack = {};
let watchers = {};

export const getCards = (stackId) => cardsByStack[stackId]

export const watch = (stackId, w) => {
  watchers[stackId] = watchers[stackId] || [];
  watchers[stackId].push(w);

  w(cardsByStack[stackId]);
};

export const unWatch = (stackId, w) => {
  watchers[stackId] = watchers[stackId].filter(watcher => watcher !== w);
};

export const updateCard = (event) => {
  let fromStackId = event.from.locationId + '-' + event.from.stack;
  let toStackId = event.to.locationId + '-' + event.to.stack;

  let fromStack = cardsByStack[fromStackId];
  let toStack = cardsByStack[toStackId] || [];

  // remove it from the old location
  let card = fromStack.find(l => l.objectLocator === event.objectLocator);
  fromStack = fromStack.filter(l => l.objectLocator !== event.objectLocator);
  if(fromStack.length === 0) fromStack = undefined;

  // add it to the new location
  toStack = toStack.filter(l => l.objectLocator !== event.objectLocator);
  toStack.push(event.card || {...card, pending: !!event.pending});

  cardsByStack[fromStackId] = fromStack;
  cardsByStack[toStackId] = toStack;

  watchers[fromStackId].forEach((watcher) => watcher(cardsByStack[fromStackId]));
  watchers[toStackId].forEach((watcher) => watcher(cardsByStack[toStackId]));
};

export const setCards = (cards) => {
  cardsByStack = {}; // need to reset
  cards.forEach((c) => {
    if(cardsByStack[c.stackId] === undefined) cardsByStack[c.stackId] = [];
    if(c.objectLocator.match(/^location:/)) {
      let locator = c.objectLocator + Math.random().toString(36).substr(2, 9);
      cardsByStack[c.stackId].push({...c, objectLocator: locator});
    } else {
      cardsByStack[c.stackId].push(c);
    }
  });
};

/*
Lifecycles:
a: simple ownership: get ownership... log move events... realise move events
b: fail early: get ownership... fail http ownership request.. release card.. ensuring actual owner has ownership in UI
c: fail late: get ownership... log move events... fail http ownership request.. release card..  revert move events.. ensuring actual owner has ownership in UI
*/
const revertPhantomEvents = (objectLocator) => {
  let [returnEvent, ...events] = ownershipEvents[objectLocator];
  ownershipEvents[objectLocator] = undefined;

  let lastEvent = (events && events[events.length - 1]) || returnEvent
  if(returnEvent === undefined) {
    // process has already been reverted...
    // maybe we received the update from an actaul card owner while we waited
    return;
  }
  // revert to the initial state on teh first event in the stack....
  let revertEvent = {
    objectLocator: objectLocator,
    from: { locationId: lastEvent.to.locationId, stack: lastEvent.to.stack },
    to: { locationId: returnEvent.from.locationId, stack: returnEvent.from.stack },
    timestamp: new Date().getTime()
  };

  updateCard(revertEvent)
};

export function addEvent(objectLocator, event) {
  let events = ownershipEvents[objectLocator];
  if(events === undefined) {
    return false
  }
  events.push(event);
  return true
}

export function takeOwnership(event) {
  if(!ownershipEvents.hasOwnProperty(event.objectLocator)) {
    ownershipEvents[event.objectLocator] = [];
    takeEvent(event.objectLocator).then(async (response) => {
      let json = await response.json();
      if(json.success !== true) {
        revertPhantomEvents(event.objectLocator)
      }
    })
  }
}

// this is exposed for testing only
export const events = (objectLocator) => {
  return ownershipEvents[objectLocator];
};

const processMoveEvent = (event) => {
 let eventsForObject = ownershipEvents[event.objectLocator];
  if(eventsForObject === undefined || eventsForObject.length === 0) {
    // if events arrive but we are waiting on ownership, just fail it
    ownershipEvents[event.objectLocator] = undefined;
    // event came from a different user so just apply them
    updateCard(event)
  } else {
    if(eventsForObject[0].timestamp !== event.timestamp) {
      // well this is bad.. We must be waiting for ownership so lets just revert now and apply the new events...
      revertPhantomEvents(event.objectLocator);
      updateCard(event)
    } else {
      eventsForObject.shift();
      // just realise the events locally
      if(eventsForObject.length === 0) {
        // set the state to not be pending and update the card object
        updateCard(event)
      }
    }
  }
};

const processEvents = (events) => {
  events.forEach((event) => {
    switch(event.eventType) {
      case "failed_move":
        break;
      case "failed_pickup":
        break;
      case "keyframe":
        break;
      case "move":
        processMoveEvent(event);
        break;
      case "pickup_card":
        break;
      case "pickup_location":
        break;
      case "player_join":
        setters.setLocations(events.players);
        break;
      case "returned_card":
        break;
    }
  })
};

let setters = {}
export const setSetters = (s) => {
  setters = {...setters, ...s}
}
export const pollEvents = async () => {
  let events = (await getUpdates()).events;
  processEvents(events);
};
