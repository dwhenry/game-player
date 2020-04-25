import { takeEvent, getUpdates } from "./utils"
import { object } from "prop-types";

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



  // update the world state for the card to the initial event...
  console.log(returnEvent);

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

export const pollEvents = () => {
  return setInterval(async () => {
    let events = await getUpdates();
    for(event in events) {
      let eventsForObject = ownershipEvents[event.objectId];
      if(eventsForObject === undefined) {
        // event came from a different user so just apply them
        // applyEvents(events)
      } else {
        let nextEvent = eventsForObject.shift();
        if(nextEvent.timestamp !== event.timestamp) {
          // well this is bad.. out events are wrong... so we need to revert them to some extent and apply these new ones...
          // revertPhantomEvents(event.objectId);
          // applyEvents(events)
        } else {
          // just realise the events locally
          
          // ...hmmm.... this is teh issue with have events different to state... I blame matt
        }
      }
    }
  }, 1000 * 5)
}