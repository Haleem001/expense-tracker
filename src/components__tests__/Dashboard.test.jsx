import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Dashboard from '../components/Dashboard'
import { logout } from '../features/auth/authSlice'
import { thunk } from 'redux-thunk';
import { applyMiddleware } from 'redux';

import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore([thunk]); // still works, but might be deprecated in docs




const mockUser = {
  id: '1',
  name: 'Test User'
};

const initialState = {
  auth: {
    user: mockUser
  }
};

const mockExpenses = [
  {
    id: '1',
    userId: '1',
    category: 'Food',
    amount: '50.00',
    date: '2023-06-15',
    description: 'Lunch'
  },
  {
    id: '2',
    userId: '1',
    category: 'Transport',
    amount: '20.00',
    date: '2023-06-16',
    description: 'Bus ticket'
  }
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockExpenses)
  })
);

describe('Dashboard Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  test('renders dashboard with user name', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  test('fetches and displays expenses', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('Bus ticket')).toBeInTheDocument();
    });
  });

  test('handles logout action', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );
    await waitFor(() => {
      const logoutButton = screen.getByTestId('logout-button');
      expect(logoutButton).toBeInTheDocument();
    });
    const logoutButton = screen.getByTestId('logout-button');

    fireEvent.click(logoutButton);

    expect(store.dispatch).toHaveBeenCalledWith(logout());
  });
  test('opens and closes add expense dialog', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );
  
    // Wait for loading to complete
    await waitFor(() => {
      const addExpenseButton = screen.getByTestId('add-expense-button');
      expect(addExpenseButton).toBeInTheDocument();
    });
  
    const addExpenseButton = screen.getByTestId('add-expense-button');
    fireEvent.click(addExpenseButton);
  
    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
  
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
  
    await waitFor(() => {
      expect(screen.queryByText('Add New Expense')).not.toBeInTheDocument();
    });
  });
  
  test('calculates total expenses correctly', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('₦70.00')).toBeInTheDocument();
    });
  });
});


