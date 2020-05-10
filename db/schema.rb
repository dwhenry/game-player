# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_09_231323) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "cards", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "identity"
    t.uuid "game_id", null: false
    t.string "card_id"
    t.string "location_id", null: false
    t.string "stack", null: false
    t.integer "stage"
    t.integer "last_move_id", null: false
    t.string "owner_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["card_id"], name: "index_cards_on_card_id"
    t.index ["game_id"], name: "index_cards_on_game_id"
    t.index ["identity"], name: "index_cards_on_identity"
    t.index ["location_id", "stack", "last_move_id"], name: "index_cards_on_location_id_and_stack_and_last_move_id"
  end

  create_table "game_configs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.jsonb "decks"
    t.uuid "parent_id"
    t.jsonb "rules"
    t.boolean "locked", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "games", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "game_config_id", null: false
    t.jsonb "cards"
    t.integer "sprint", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "params"
    t.jsonb "players"
    t.string "name"
    t.string "state"
    t.index ["game_config_id"], name: "index_games_on_game_config_id"
  end

  add_foreign_key "cards", "games"
  add_foreign_key "games", "game_configs"
end
