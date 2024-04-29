import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Requirement } from '../../types/requirement';
import { getAllRequirement } from '../../apis/userAPI';

interface InitState {
  loading?: boolean;
  requirements?: Requirement[] | undefined;
  error: string;
}

const initialState: InitState = {
  loading: false,
  requirements: undefined,
  error: '',
};

/**
 * Get all requirement from firestore database
 * @param {string} userId - User id, if isAdmin then userId is null to get all requirements
 * @returns {Promise} - Promise<Requirement | null>
 */
export const getAllRequirementAsync = createAsyncThunk(
  'requirement/getAllRequirement',
  async ({ userId }: { userId: string | null }): Promise<Requirement[]> => {
    const requirements = await getAllRequirement({ userId });
    return requirements;
  },
);

const requirementSlice = createSlice({
  name: 'requirement',
  initialState,
  reducers: {
    setRequirements: (state, action: PayloadAction<Requirement[]>) => {
      state.requirements = action.payload;
    },
    updateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    clearUser: (state) => {
      state.requirements = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllRequirementAsync.pending, (state) => {
      state.error = '';
      state.loading = true;
    });
    builder.addCase(getAllRequirementAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.requirements = action.payload;
    });
    builder.addCase(getAllRequirementAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '';
    });
  },
});

const { actions, reducer } = requirementSlice;
export const { updateError, clearError, clearUser } = actions;
export default reducer;
