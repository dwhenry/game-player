FactoryBot.define do
  factory :game_config do
    transient do
      tasks { {} }
      employees { {} }
      achievements { { }}
    end

    parent_id { nil }
    rules { nil }
    locked { false }
    decks { { tasks: tasks, employees: employees, achievements: achievements} }

    trait :single_task do
      transient do
        tasks do 
          card1_id = SecureRandom.uuid
          {
            card1_id => {
              id: card1_id,
              cost: "5B",
              deck: "tasks",
              name: "Pivot",
              number: "2",
              rounds: "",
              actions: "+1 Employee"
            }
           } 
        end
      end
    end
  end

    # decks:
    #   {"tasks"=>
    #     {"007a4dc8-2f23-4950-9420-643427239dc2"=>
    #       {"id"=>"007a4dc8-2f23-4950-9420-643427239dc2",
    #        "cost"=>"5B",
    #        "deck"=>"tasks",
    #        "name"=>"Pivot",
    #        "number"=>"1",
    #        "rounds"=>"",
    #        "actions"=>"+1 Employee"},
    #      "074e7d21-6767-47be-b3f3-64289da0ba2f"=>
    #       {"id"=>"074e7d21-6767-47be-b3f3-64289da0ba2f",
    #        "cost"=>"5B",
    #        "deck"=>"tasks",
    #        "name"=>"Task: 5 point",
    #        "number"=>"1",
    #        "rounds"=>"",
    #        "actions"=>"5 token\r\n" + "4 token = 1 achievement"},
    #     },
    #    "employees"=>
    #     {"05ec907b-47ca-4970-a068-f68bb17c1842"=>
    #       {"id"=>"05ec907b-47ca-4970-a068-f68bb17c1842",
    #        "cost"=>"0B",
    #        "deck"=>"employees",
    #        "name"=>"Rock Star",
    #        "number"=>"1",
    #        "rounds"=>"",
    #        "actions"=>
    #         "Take some drugs with the result of each round beinga s follows:\r\n" +
    #         "* -2 WU\r\n" +
    #         "* -1 WU\r\n" +
    #         "* roll a dice on a 6 you die, on a 1-3 +2 WU"},
    #      "12a1d0b3-30d0-4f43-b87d-879c15b8b1d1"=>
    #       {"id"=>"12a1d0b3-30d0-4f43-b87d-879c15b8b1d1",
    #        "cost"=>"0B",
    #        "deck"=>"employees",
    #        "name"=>"Arguist",
    #        "number"=>"1",
    #        "rounds"=>"",
    #        "actions"=>
    #         "* -1 WU for each task card in play\r\n" +
    #         "* -2 WU for any tracking card in play"},
    #     },
    #    "achievements"=>{}},
    # end
end
