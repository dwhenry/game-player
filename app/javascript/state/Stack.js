import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cardUpdate, sortedInsert } from "../modules/utils";

const initialState = {
  cards: { tasks: [], achievements: [], employees: [] },
  currentCard: null,
  edits: false
}

const defaultCard = {
  id: "",
  name: "",
  cost: "",
  rounds: "",
  actions: "",
  deck: "",
  number: ""
}

const response = await fetch('/game_configs/' + window.gameID, {
    method: 'PATCH',
    headers: {
      "X-CSRF-Token": getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

export const configSaveCard = createAsyncThunk('config/saveCard', async card => {
  const response = cardUpdate({ card: card })
  return response.card
})

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    configAddCards(state, action) {
      state.edits = false
      state.cards = {
        tasks: action.payload.cards.filter(c => c.deck === 'tasks'),
        achievements: action.payload.cards.filter(c => c.deck === 'achievements'),
        employees: action.payload.cards.filter(c => c.deck === 'employees')
      }
      state.currentCard = {...defaultCard, ...action.payload.selected}
    },
    configSetCard(state, action) {
      if (state.edits) {
        alert('Unable to Change card as pending edits exist');
      } else {
        // let initialCard = card;
        state.currentCard = {...defaultCard, ...action.payload.selected}
      }
    },
    configUpdateCard(state, action) {
      return {
        ...state,
        currentCard: {...action.payload.card, id: state.currentCard.id, deck: state.currentCard.deck},
        edits: true
      }
    },
    configCancelEdit(state) {
      return {
        ...state,
        currentCard: null,
        edits: false
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(saveCard.pending, (state, action) => {
        alert("Card failed to save - please refresh to maintain state")
      })
      .addCase(saveCard.fulfilled, (state, action) => {
        let savedCard = action.payload
        return {
          currentCard: savedCard,
          cards: {
            ...state.cards,
            [savedCard.deck]: sortedInsert(savedCard, state.cards[savedCard.deck], (card) => card.name)
          },
          edits: false
        }
      })
  }
})


export const { configAddCards, configSetCard, configSaveCard, configUpdateCard, configCancelEdit } = todosSlice.actions

export default configSlice.reducer