import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base URL for the API
const API_URL = 'http://localhost:3001';

// Get initial state from localStorage
const loadAuthState = () => {
  try {
    const serializedAuth = localStorage.getItem('authState');
    if (serializedAuth === null) {
      return {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    }
    return JSON.parse(serializedAuth);
  } catch (err) {
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false
    };
  }
};

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Get users that match the username
      const response = await fetch(`${API_URL}/users?username=${credentials.username}`);
      const users = await response.json();
      
      // Find user with matching password
      const user = users.find(user => user.password === credentials.password);
      
      if (!user) {
        return rejectWithValue('Invalid username or password');
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Signup thunk
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      // Check if username already exists
      const checkResponse = await fetch(`${API_URL}/users?username=${userData.username}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        return rejectWithValue('Username already exists');
      }
      
      // Create new user
      const createResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!createResponse.ok) {
        throw new Error('Failed to create user');
      }
      
      const newUser = await createResponse.json();
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage on logout
      localStorage.removeItem('authState');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        // Save to localStorage
        localStorage.setItem('authState', JSON.stringify({
          user: action.payload,
          isAuthenticated: true,
          loading: false,
          error: null
        }));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        // Save to localStorage
        localStorage.setItem('authState', JSON.stringify({
          user: action.payload,
          isAuthenticated: true,
          loading: false,
          error: null
        }));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
