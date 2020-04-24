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
  // Rails.ajax({
  //   url: '/games/' + window.game_id + '.json',
  //   type: 'put',
  //   beforeSend(xhr, options) {
  //     xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  //     options.data = data;
  //     return true
  //   },
  //   success: function (response, t, x) {
  //     if (response.locations) {
        
  //     }
  //   },
  //   error: function (response) {
  //     if (response.error) {
  //       alert(error + response.error);
  //       window.action_id = response.next_action;
  //     }
  //   },
  // });
}

export async function takeEvent(objectId) {
  fetch('/games/' + window.gameBoardId + '/ownership/' + objectId, {
    method: 'POST',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    }
  })
}

export async function postEvent(objectId, data) {
  fetch('/games/' + window.gameBoardId + '/ownership/' + objectId, {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function cardUpdate(data) {
  const response = await fetch('/game_configs/' + window.gameId, {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
