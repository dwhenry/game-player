Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :games do
    member { post :join }

    resources :ownership, only: [] do
      collection { post ':object_id', action: :take }
    end
  end

  resources :game_configs

  root 'home#index'
end
