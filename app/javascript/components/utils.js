import Rails from "@rails/ujs"

function getCSRFToken() {
  const csrfToken = document.querySelector("[name='csrf-token']")

  if (csrfToken) {
    return csrfToken.content
  } else {
    return null
  }
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
  console.log(window.location.origin);
  const response = await fetch('/game_configs/' + game_id, {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  return await response.json();


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
