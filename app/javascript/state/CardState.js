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
}

export const unWatch = (stackId, w) => {
  watchers[stackId] = watchers[stackId].filter(watcher => watcher !== w);
}

export const updateCard = (event) => {
  let fromStackId = event.from.locationId + '-' + event.from.stack;
  let toStackId = event.to.locationId + '-' + event.to.stack;

  let fromStack = cardsByStack[fromStackId];
  let toStack = cardsByStack[toStackId] || [];

  // remove it from the old location
  let card = fromStack.find(l => l.objectId === event.objectId);
  fromStack = fromStack.filter(l => l.objectId !== event.objectId);
  if(fromStack.length === 0) fromStack = undefined;

  // add it to the new location
  toStack = toStack.filter(l => l.objectId !== event.objectId);
  toStack.push(event.card || {...card, pending: !!event.pending});

  cardsByStack[fromStackId] = fromStack;
  cardsByStack[toStackId] = toStack;

  watchers[fromStackId].forEach((watcher) => watcher(cardsByStack[fromStackId]));
  watchers[toStackId].forEach((watcher) => watcher(cardsByStack[toStackId]));
};

export const setCards = (cards) => {
  cards.forEach((c) => {
    if(cardsByStack[c.stackId] == undefined) cardsByStack[c.stackId] = [];
    if(c.objectId =~ /^location:/) {
      cardsByStack[c.stackId].push({...c, objectId: c.objectId + "-" + Math.random().toString(36).substr(2, 9)});
    } else {
      cardsByStack[c.stackId].push(c);
    }
  });
  console.log(cardsByStack);
};

/*
Lifecycles:
a: simple ownershiip: get ownership... log move events... realise move events
b: fail early: get ownership... fail http ownership request.. release card.. ensuring actual owner has ownership in UI
c: fail late: get ownership... log move events... fail http ownership request.. release card..  revert move events.. ensuring actual owner has ownership in UI
*/
const revertPhantomEvents = (objectId) => {
  let [returnEvent, ...events] = ownershipEvents[objectId];
  ownershipEvents[objectId] = undefined;

  let lastEvent = (events && events[events.length - 1]) || returnEvent
  if(returnEvent === undefined) {
    // process has already been reverted...
    // maybe we received the update from an actaul card owner while we waited
    return;
  }
  // revert to the initial state on teh first event in the stack....
  let revertEvent = {
    objectId: objectId,
    from: { locationId: lastEvent.to.locationId, stack: lastEvent.to.stack },
    to: { locationId: returnEvent.from.locationId, stack: returnEvent.from.stack },
    timestamp: new Date().getTime()
  }

  updateCard(revertEvent)
}

export function addEvent(objectId, event) {
  let events = ownershipEvents[objectId];
  if(events === undefined) {
    return false
  }
  events.push(event);
  return true
}

export function takeOwnership(event) {
  if(!ownershipEvents.hasOwnProperty(event.objectId)) {
    ownershipEvents[event.objectId] = [];
    takeEvent(event.objectId).then(async (response) => {
      let json = await response.json();
      if(json.success !== true) {
        revertPhantomEvents(event.objectId)
      }
    })
  }
}

// this is exposed for testing only
export const events = (objectId) => {
  return ownershipEvents[objectId];
};

const processMoveEvents = (events) => {
  events.filter(ev => ev.eventType === 'move').forEach((event) => {
    let eventsForObject = ownershipEvents[event.objectId];
    if(eventsForObject === undefined || eventsForObject.length === 0) {
      // if events arrive but we are waiting on ownership, just fail it
      ownershipEvents[event.objectId] = undefined;
      // event came from a different user so just apply them
      updateCard(event)
    } else {
      if(eventsForObject[0].timestamp !== event.timestamp) {
        // well this is bad.. We must be waiting for ownership so lets just revert now and apply the new events...
        revertPhantomEvents(event.objectId);
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
  })
};

const processLogEvents = (events) => {
  events.forEach((event) => {
    switch(event.eventType) {
      case "failed_move":
        break;
      case "failed_pickup":
        break;
      case "keyframe":
        break;
      case "move":
        break;
      case "pickup_card":
        break;
      case "pickup_location":
        break;
      case "player_join":
        break;
      case "returned_card":
        break;
    }
  })
};

export const pollEvents = async () => {
  let events = (await getUpdates()).events;
  processMoveEvents(events);
  processLogEvents(events);
};
