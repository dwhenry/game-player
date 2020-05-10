Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :games do
    member {
      post :join
      post :start
    }

    resources :cards, only: [] do
      member { post 'take' }
    end
  end

  resources :game_configs

  root 'home#index'
end
