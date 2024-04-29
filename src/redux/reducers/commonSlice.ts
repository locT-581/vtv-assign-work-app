import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Popup {
  isShowPopup: boolean;
  popupElement?: React.ReactNode;
}

interface InitState {
  isShowPopup: boolean;
  popupElement?: React.ReactNode;
}

const initialState: InitState = {
  isShowPopup: false,
  popupElement: null,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    switchPopup: (state, action: PayloadAction<Popup>) => {
      state.isShowPopup = action.payload.isShowPopup;
      state.popupElement = action.payload.popupElement;
      console.log('🚀 ~  state.isShowPopup :', state.isShowPopup);
    },
  },
  extraReducers: () => {},
});

const { actions, reducer } = commonSlice;
export const { switchPopup } = actions;
export default reducer;
