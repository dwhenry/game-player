import { takeEvent } from "./utils"

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
  // update the world state for the card to the initial event...
  console.log(returnEvent);

}

export function addEvent(objectId, event) {
  let events = ownershipEvents[event.objectId];
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

  if(ownershipEvents.hasOwnProperty(event.objectId)) {
    if(ownershipEvents[event.objectId] !== 'unowned') {
      ownershipEvents[event.objectId].push(event);
    } else {
      revertPhantomEvents(event.objectId)
    }
  } else {
    ownershipEvents[event.objectId] = [event];
    takeEvent(event.objectId).then(async (response) => {
      console.log(response)
      let json = await response.json();
      if(json.success !== true) {
        revertPhantomEvents(event.objectId)
      }
    })
  }
};