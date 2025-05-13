import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import expensesReducer from '../features/expenses/expensesSlice'

const configureStoreWithPreloadedState = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      expenses: expensesReducer
    },
    preloadedState
  })
}

export default configureStoreWithPreloadedState