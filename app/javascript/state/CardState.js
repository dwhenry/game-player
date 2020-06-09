import React from 'react';
import { takeEvent, getUpdates } from '../modules/utils'
import { RecoilAPI } from './RecoilAPI'

let ownershipEvents = {};

export const updateCard = (event, matchRequired) => {
  let fromStackId = event.from.locationId + '-' + event.from.stack;
  let toStackId = event.to.locationId + '-' + event.to.stack;
  let card;

  RecoilAPI.stackSetter(fromStackId)((fromStack) => {
    // remove it from the old location
    card = fromStack.find(l => l.objectLocator === event.objectLocator);
    let fromStackLength = fromStack.length;

    fromStack = fromStack.filter(l => l.objectLocator !== event.objectLocator);
    if(fromStackLength === fromStack.length && event.objectLocator.match(/^location:/) && !matchRequired) {
      fromStack.shift();
    }
    if(fromStack.length === 0) fromStack = undefined;

    fromStack
  })

  RecoilAPI.stackSetter(toStackId)((toStack) => {
    // add it to the new location
    toStack = toStackId || [];
    toStack = toStack.filter(l => l.objectLocator !== event.objectLocator);
    toStack.push(event.card || {...card, pending: !!event.pending});

    toStack
  })
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
    updateCard(event, false)
  } else {
    if(eventsForObject[0].timestamp !== event.timestamp) {
      // well this is bad.. We must be waiting for ownership so lets just revert now and apply the new events...
      revertPhantomEvents(event.objectLocator);
      updateCard(event, false)
    } else {
      eventsForObject.shift();
      // just realise the events locally
      if(eventsForObject.length === 0) {
        // set the state to not be pending and update the card object
        updateCard(event, true)
      } else if(event.card.objectLocator !== event.objectLocator) {
        // locator has updated to fix the events stack to represent this
        ownershipEvents[event.card.objectLocator] = ownershipEvents[event.objectLocator];
        ownershipEvents[event.objectLocator] = undefined;
      }
    }
  }
};

const processEvents = (events) => {
  events.forEach((event) => {
    if(lastEventId < event.order) {
      let message;
      setLastEventId(event.order);
      switch (event.eventType) {
        case "failed_move":
          break;
        case "failed_pickup":
          message = event.username + " failed to picked up the " + event.data.card_name + " card from " + event.data.location_id + ':' + event.data.stack;
          break;
        case "keyframe":
          break;
        case "move":
          processMoveEvent(event);
          break;
        case "pickup_card":
          message = event.username + " picked up the " + event.data.card_name + " card from " + event.data.location_id + ':' + event.data.stack;
          break;
        case "pickup_location":
          message = event.username + " picked up a card from " + event.data.location_id + ':' + event.data.stack;
          break;
        case "player_join":
          let position = setters.setLocations(event.data);
          message = event.username + " joined the game in position " + position;
          break;
        case "returned_card":
          break;
      }
      if(message) {
        setters.addLog({
          key: event.key,
          order: event.order,
          gameID: event.gameID,
          timestamp: event.timestamp,
          user: event.data.player_name,
          message: message
        });
      }
    }
  })
};

let lastEventId;
export const setLastEventId = (eventId) => {
  lastEventId = eventId
};


let setters = {};
export const setSetters = (s) => {
  setters = {...setters, ...s}
};
export const pollEvents = async () => {
  let events = (await getUpdates(lastEventId)).events;
  processEvents(events);
};
