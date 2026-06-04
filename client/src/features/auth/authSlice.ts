import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: null | { id: string; name: string; email: string; role: string };
}

const isRealJwt = (token: string | null): boolean =>
  Boolean(token && token.split('.').length === 3);

const loadState = (): AuthState => {
  try {
    const serializedAuth = localStorage.getItem('auth');
    if (serializedAuth === null) {
      return { token: null, isAuthenticated: false, user: null };
    }
    const parsed = JSON.parse(serializedAuth);
    // If stored token is not a real JWT (e.g. old dummy token), clear it
    if (!isRealJwt(parsed.token)) {
      localStorage.removeItem('auth');
      return { token: null, isAuthenticated: false, user: null };
    }
    return parsed;
  } catch (err) {
    return { token: null, isAuthenticated: false, user: null };
  }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthState['user'] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('auth', JSON.stringify({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
