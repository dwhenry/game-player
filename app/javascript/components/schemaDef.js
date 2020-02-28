export const deckDefintion = {
  "$id": "https://example.com/deck.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Deck",
  "description": "Player cards.",
  "required": ["tasks", "achievements", "employees"],
  "type": "object",
  "properties": {
    "tasks": {
      "type": "array",
      "items": {"$ref": "#/definitions/card"}
    },
    "achievements": {
      "type": "array",
      "items": {"$ref": "#/definitions/card"}
    },
    "employees": {
      "type": "array",
      "items": {"$ref": "#/definitions/card"}
    },
  },
  "definitions": {
    "card": {
      "required": ["cost", "deck", "name", "number", "rounds"],
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "cost": {"type": "string", "minLength": 1},
        "deck": {"type": "string", "minLength": 1},
        "name": {"type": "string", "minLength": 3},
        "number": {"type": "string", "minLength": 1},
        "rounds": {"type": "string", "minLength": 1},
        "actions": {"type": "string"}
      }
    }
  }
}
