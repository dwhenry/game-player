import Rails from "@rails/ujs"

function getCSRFToken() {
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
  array.splice(sortedIndex(element, array, proc) + 1, 0, element);
  console.log(array)
  return array;
}

export function ajaxUpdate(data, error) {
  Rails.ajax({
    url: '/games/' + window.game_id + '.json',
    type: 'put',
    beforeSend(xhr, options) {
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      options.data = data;
      return true
    },
    success: function (response, t, x) {
      if (response.locations) {
        window.update_board(response.locations, response.players, response.next_action);
      }
    },
    error: function (response) {
      if (response.error) {
        alert(error + response.error);
        window.action_id = response.next_action;
      }
    },
  });
}

export async function cardUpdate(data, game_id) {
  console.log('-----------------------------' + game_id)
  const response = await fetch('/game_configs/' + game_id, {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
console.log('-----------------------------!!!!!!! FUCK THIS AT THE END')
    return response.json();


  // Rails.ajax({
  //   url: '/game_configs/' + game_id,
  //   type: 'post',
  //   beforeSend(xhr, options) {
  //     xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  //     options.data = data;
  //     return true
  //   },
  //   success: success,
  //   error: error,
  // });
}
