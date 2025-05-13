import { render, screen, fireEvent, waitFor } from './test-utils'
import Dashboard from '../components/Dashboard'

describe('Expense Tracker', () => {
    beforeEach(() => {
      render(<Dashboard />)
    })

    it('adds a new expense', async () => {
      // Open add expense dialog using the specific button with data-testid
      const addExpenseButton = screen.getByTestId('add-expense-button')
      fireEvent.click(addExpenseButton)

      // Fill out expense form
      const descriptionInput = screen.getByPlaceholderText('Description')
      const amountInput = screen.getByPlaceholderText('Amount')
      const categorySelect = screen.getByPlaceholderText('Category')
    
      // Find the dialog's submit button specifically
      const submitButton = screen.getByRole('button', { 
        name: /add expense/i 
      })

      // Fill out the form
      fireEvent.change(descriptionInput, { target: { value: 'Groceries' } })
      fireEvent.change(amountInput, { target: { value: '50.00' } })
      fireEvent.change(categorySelect, { target: { value: 'Food' } })

      // Submit the expense
      fireEvent.click(submitButton)

    
    })
})