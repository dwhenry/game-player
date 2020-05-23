Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :games do
    member {
      post :join
      post :start
    }

    resources :cards, only: [] do
      member {
        post 'take'
        post 'move'
      }
    end
  end

  resources :game_configs

  post '/player_name' => 'home#player', as: :player_name

  root 'home#index'
end
