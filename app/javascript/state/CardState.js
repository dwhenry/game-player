import React from 'react';
import { takeEvent, getUpdates } from '../modules/utils'

let cardsByStack = {};
let watchers = {};

export const getCards = (stackId) => cardsByStack[stackId]

export const watch = (stackId, w) => {
  watchers[stackId] = watchers[stackId] || [];
  watchers[stackId].push(w);

  w(cardsByStack[stackId]);
}

export const unWatch = (stackId, w) => watchers[stackId] = watchers[stackId].filter(watcher => watcher != w);

export const updateCard = (event) => {
  let fromStackId = event.from.locationId + '-' + event.from.stack;
  let toStackId = event.to.locationId + '-' + event.to.stack;

  let fromStack = cardsByStack[fromStackId];
  let toStack = cardsByStack[toStackId] || [];

  // remove it from the old location
  let card = fromStack.find(l => l.objectId === event.objectId)
  fromStack = fromStack.filter(l => l.objectId !== event.objectId)

  // add it to the new location
  toStack = toStack.filter(l => l.objectId !== event.objectId)
  toStack.push(event.card || {...card, pending: !!event.pending})

  cardsByStack[fromStackId] = fromStack;
  cardsByStack[toStackId] = toStack;

  watchers[fromStackId].forEach((watcher) => watcher(cardsByStack[fromStackId]))
  watchers[toStackId].forEach((watcher) => watcher(cardsByStack[toStackId]))
}

export const setCards = (cards) => {
  cards.forEach((c) => {
    if(cardsByStack[c.stackId] == undefined) cardsByStack[c.stackId] = [];
    if(c.count) {
      for(let i=0; i < c.count; i++) {
        cardsByStack[c.stackId].push({...c, objectId: c.objectId + "-" + i});
      }
    } else {
      cardsByStack[c.stackId].push(c);
    }
  })
}


// takeOwnership
// addPhantomEvent
// revertPhantomEvents
// pollEventLog 
let ownershipEvents = {}


/**
 * dragStart on card 
 *   send http request to take ownership and mark as owned in local state
 * http request returns with success or fail
 *   if fail
 *     
 */

/*
Lifecycles:
a: simple ownershiip: get ownership... log move events... realise move events
b: fail early: get ownership... fail http ownership request.. release card.. ensuring actual owner has ownership in UI
c: fail late: get ownership... log move events... fail http ownership request.. release card..  revert move events.. ensuring actual owner has ownership in UI
*/
const revertPhantomEvents = (objectId) => {
  let [returnEvent, ...events] = ownershipEvents[objectId];
  if(returnEvent === undefined) {
    // the shit has hit the fan, how did we get here????
    return;
  }
  // revert to the first event in some way???



  // update the world state for the card to the initial event..

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
  // make card locally as owned
  // start or maintain an event stream for the object
  // have the ability to revert the change..

  if(!ownershipEvents.hasOwnProperty(event.objectId)) {
    ownershipEvents[event.objectId] = [];
    takeEvent(event.objectId).then(async (response) => {
      let json = await response.json();
      if(json.success !== true) {
        revertPhantomEvents(event.objectId)
      }
    })
  }
};

// this is exposed for testing only
export const events = (objectId) => {
  return ownershipEvents[objectId];
}

export const pollEvents = async () => {
  let events = (await getUpdates()).events;
  let lastEvent = events[events.length - 1];

  events.forEach((event) => {
    let eventsForObject = ownershipEvents[event.objectId];
    if(eventsForObject === undefined || eventsForObject.length === 0) {
      // event came from a different user so just apply them
      updateCard(event)
    } else {
      let nextEvent = eventsForObject.shift();
      if(nextEvent.timestamp !== event.timestamp) {
        // well this is bad.. our events are wrong or out of sequence... so we need to revert them to some extent and apply these new ones...
        // revertPhantomEvents(event.objectId);
        // applyEvents(events)
      } else {
        // just realise the events locally
        if(event === lastEvent) {
          // set the state to not be pending and update the card object
          updateCard(event)
        }
        // else ignore the event as we still have pending
      }
    }
  })
}