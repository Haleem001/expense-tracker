import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import configureStore from '../store/configureStore'

const theme = createTheme()

const AllTheProviders = ({ children }) => {
  const store = configureStore({
    auth: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      },
      isAuthenticated: true
    },
    expenses: {
      expenses: [], // Initial empty expenses array
      loading: false,
      error: null
    }
  })

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

const customRender = (ui, options) => 
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
