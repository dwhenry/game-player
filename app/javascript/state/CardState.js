import React from 'react';
import { takeEvent, getUpdates } from '../modules/utils'

let cardsByStack = {};
let watchers = {};

export const getCards = (stackId) => cardsByStack[stackId]

export const watch = (stackId, w) => {
  watcher[stackId] = watcher[stackId] || [];
  watchers[stackId].push(w);
  w(cardsByStack[stackId]);
}

export const unWatch = (stackId, w) => watchers[stackId] = watchers[stackId].filter(watcher => watcher != w);

export const updateCard = (event) => {
  let fromLocationId = event.from.locationId + '-' + event.from.stack;
  let toLocationId = event.to.locationId + '-' + event.to.stack;

  let fromLocation = cardsByStack[fromLocationId];
  let toLocation = cardsByStack[toLocationId] || [];

  // remove it from the old location
  let card = fromLocation.find(l => l.objectId === event.objectId)
  fromLocation = fromLocation.filter(l => l.objectId !== event.objectId)

  // add it to the new location
  toLocation = toLocation.filter(l => l.objectId !== event.objectId)
  toLocation.push(event.card || {...card, pending: !!event.pending})

  cardsByStack[fromLocationId] = fromLocation;
  cardsByStack[toLocationId] = toLocation;

  watchers[fromLocationId].forEach((watcher) => watcher(cardsByStack[fromLocationId]))
  watchers[toLocationId].forEach((watcher) => watcher(cardsByStack[toLocationId]))
}

export const setCards = (cards) => {
  cards.forEach((c) => {
    if(cardsByStack[c.locationId] == undefined) cardsByStack[c.locationId] = [];
    if(c.count) {
      for(let i=0; i < c.count; i++) {
        cardsByStack[c.locationId].push({...c, objectId: c.objectId + "-" + i});
      }
    } else {
      cardsByStack[c.locationId].push(c);
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
    if(eventsForObject === undefined) {
      // event came from a different user so just apply them
      // applyEvents(events)
    } else {
      let nextEvent = eventsForObject.shift();
      if(nextEvent.timestamp !== event.timestamp) {
        // well this is bad.. our events are wrong or out of sequence... so we need to revert them to some extent and apply these new ones...
        // revertPhantomEvents(event.objectId);
        // applyEvents(events)
      } else {
        // just realise the events locally
        if(event === lastEvent) {
          console.log('best')
          // set the state to not be pending and update the card object
          updateCard(event)
        }
        // else ignore the event as we still have pending
      }
    }
  })
}