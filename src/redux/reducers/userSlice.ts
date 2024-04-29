import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/user';
import { getUserById } from '../../apis/userAPI';

interface InitState {
  loading?: boolean;
  user?: User | null;
  error: string;
}

const initialState: InitState = {
  user: null,
  error: '',
};

/**
 * Login user to app
 */
export const getUserByIdAsync = createAsyncThunk(
  'users/getUserByIdAsync',
  async (id: string): Promise<User | null> => await getUserById(id),
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    updateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByIdAsync.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, payload) => {
        state.loading = false;
        state.user = payload.payload;
      });
  },
});

const { actions, reducer } = userSlice;
export const { updateError, clearError, clearUser } = actions;
export default reducer;
