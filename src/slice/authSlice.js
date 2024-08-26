import { createSlice } from '@reduxjs/toolkit';
import { save, get, remove } from '../utility/internalMemory';

const initialState = {
  user: get('user') || null,
  token: get('token') || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.status = 'loggedIn';
      save('user', user);
      save('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      remove('user');
      remove('token');
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUser: (state, action) => {
      const { user, token } = action.payload || {};
      if (!user || !token) {
        state.error = 'User data and token are required';
        return;
      }
      state.user = user;
      state.token = token;
      state.status = 'loggedIn';
      save('user', user);
      save('token', token);
    },
    updateUser: (state, action) => {
      const { user } = action.payload || {};
      if (!user) {
        state.error = 'User data is required';
        return;
      }
      state.user = { ...state.user, ...user };
      save('user', state.user);
    },
  },
});

export const { login, logout, setError, setUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
