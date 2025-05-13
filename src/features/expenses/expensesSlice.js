import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  expenses: [],
  loading: false,
  error: null
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload)
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        expense => expense.id !== action.payload
      )
    }
  }
})

export const { addExpense, setExpenses, deleteExpense } = expensesSlice.actions
export default expensesSlice.reducer
