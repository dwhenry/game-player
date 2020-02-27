import Rails from "@rails/ujs"

export function ajaxUpdate(data, error) {
  Rails.ajax({
    url: '/games/' + window.game_id, // + '.json',
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

