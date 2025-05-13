import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import AllExpenses from '../components/AllExpenses';

const mockStore = configureMockStore([thunk]);

const mockUser = {
  id: '1',
  name: 'Test User'
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

describe('AllExpenses Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: mockUser
      }
    });
  });

  test('renders expenses table with correct data', async () => {
    render(
      <Provider store={store}>
        <Router>
          <AllExpenses />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('Bus ticket')).toBeInTheDocument();
    });
  });

  test('filters expenses by search term', async () => {
    render(
      <Provider store={store}>
        <Router>
          <AllExpenses />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      const searchInput = screen.getByLabelText('Search');
      fireEvent.change(searchInput, { target: { value: 'Lunch' } });
      
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.queryByText('Bus ticket')).not.toBeInTheDocument();
    });
  });


   
  

  test('calculates total and summary correctly', async () => {
    render(
      <Provider store={store}>
        <Router>
          <AllExpenses />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('₦70.00')).toBeInTheDocument(); // Total amount
      expect(screen.getByText('2')).toBeInTheDocument(); // Total records
      expect(screen.getByText('₦35.00')).toBeInTheDocument(); // Average amount
    });
  });

 
});
