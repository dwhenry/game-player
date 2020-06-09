import Rails from "@rails/ujs"

export function getCSRFToken() {
  const csrfToken = document.querySelector("[name='csrf-token']")

  if (csrfToken) {
    return csrfToken.content
  } else {
    return null
  }
}

function sortedIndex(array, value, proc) {
    let low = 0,
        high = array.length,
        calcValue = proc(value);

    while (low < high) {
        let mid = (low + high) >>> 1;
        if (proc(array[mid]) < calcValue) low = mid + 1;
        else high = mid;
    }
    return low;
}

export function sortedInsert(element, array, proc) {
  if(proc === undefined) proc = (item) => item;
  array = array.filter((item) => item.id != element.id);
  array.splice(sortedIndex(array, element, proc), 0, element);
  return array;
}

export async function ajaxUpdate(data, error) {
  const response = await fetch( '/games/' + window.gameBoardId, {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if(response.success) {
    let json = response.json();
    window.update_board(json.locations, json.players, json.next_action);
  }
}

export async function getUpdates(lastEventId) {
  const response = await fetch('/games/' + window.gameBoardId + '/events?since=' + lastEventId, {
    method: 'GET',
    headers: {
      // "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

export async function takeEvent(objectLocator) {
  return fetch('/games/' + window.gameBoardId + '/cards/' + objectLocator + '/take', {
    method: 'POST',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    }
  })
}

export async function postEvent(objectLocator, data) {
  fetch('/games/' + window.gameBoardId + '/cards/' + objectLocator + '/move', {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({event: 'cardMove', data: data}),
  })
}

export async function cardUpdate(data) {
  const response = await fetch('/game_configs/' + window.gameID, {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export const groupCardsByStack = (cards) => {
  let cardsByStack = {}; // need to reset
  let stacks = []
  cards.forEach((c) => {
    if(cardsByStack[c.stackId] === undefined) {
      cardsByStack[c.stackId] = [];
      stacks.push(c.stackId)
    }
    if(c.objectLocator.match(/^location:/)) {
      let locator = c.objectLocator + Math.random().toString(36).substr(2, 9);
      cardsByStack[c.stackId].push({...c, objectLocator: locator});
    } else {
      cardsByStack[c.stackId].push(c);
    }
  });

  return [stacks, cardsByStack];
};
