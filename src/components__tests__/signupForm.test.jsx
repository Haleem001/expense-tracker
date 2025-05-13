import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as reactRouterDom from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import SignupForm from '../components/signupForm';
import { signup } from '../features/auth/authSlice';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

const mockStore = configureMockStore([thunk]);

jest.mock('../features/auth/authSlice', () => ({
  signup: jest.fn()
}));

describe('SignupForm Component', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        error: null,
        loading: false
      }
    });
  });


  test('handles successful signup', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => mockNavigate);

    // Mock dispatch to resolve with a payload
    signup.mockImplementation(() => ({
      type: 'auth/signup/fulfilled',
      payload: { id: '1', username: 'testuser', name: 'Test User' },
      unwrap: jest.fn().mockResolvedValue({ id: '1', username: 'testuser', name: 'Test User' })
    }));

    render(
      <Provider store={store}>
        <Router>
          <SignupForm />
        </Router>
      </Provider>
    );

    const usernameInput = screen.getByLabelText('Username');
    const nameInput = screen.getByLabelText('Full Name');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        name: 'Test User'
      });

    });
  });


});