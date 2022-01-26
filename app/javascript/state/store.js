import { configureStore } from '@reduxjs/toolkit'
import { configReducer } from './Stack';


const store = configureStore({
  reducer: {
    config: configReducer,
  }
})

export default store