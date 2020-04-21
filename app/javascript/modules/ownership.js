

// takeOwnership
// addPhantomEvent
// revertPhantomEvents
// pollEventLog 
let ownershipEvents = {}

const takeOwnership = (event) => {
  // make card locally as owned
  // start or maintain an event stream for the object
  // have the ability to revert the change..

  if(ownershipEvents.key(event.objectId) && ownershipEvents[event.objectId] != 'notOwned') {
    ownershipEvents[event.objectId].push(event);
  } else {
    ownershipEvents[event.objectId] = [event];
  }
  fetch('/games/' + gameId + '/take_ownership')
};