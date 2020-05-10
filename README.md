# GamePlayer

> A repository for playing games as a player.

## Contributors

@dwhenry & @lamp

This is a test application to allow us to learn react within a rails application.
This allows us to play an online card game in 'real time'.

## Requirements

- Ruby
- Rails
- React
- An open mind

## TODO:

- [x] write some JS tests
  - [x] Improve data model in the UI
  - [x] Allow async moving of cards
  - [x] Replace GIL with cards based locking
- [ ] Make backend work with current state
- [x] ~Add user move ID to take/move request... this is required to ensure valid~ 
      ~card ownership (could just be timestamp??) when multiple moves are queued~
      Not required as moves will now be atomic
- [ ] Ownership expiry - ~this is currently set to 10 seconds in redis so we need~ 
      ~to ping when we have a card to keep it alive~ 
- [ ] Get a proper auth strategy in place
- [ ] Remove the min-cards param for locations - fix in config??
- [ ] Better session security
  - [ ] Player Naming
  - [ ] Game Naming
- [ ] Reduce game down to simplest form
  - [ ] Rethink card list
- [ ] Tokens, money etc.
  - [ ] Add redux (or similar) here.
- [ ] Make it pretty
  - [ ] Fiverr a designer.

### Technical

- [x] ~replace card.id with card.identity in the JS~ reverted to using ID
- [ ] Move to Puma
- [ ] Encrypt cookies sop they can't be modified
- [ ] Write some integration tests (~cucumber?~)
