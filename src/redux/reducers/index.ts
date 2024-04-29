import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import commonSlice from './commonSlice';
import requirementSlice from './requirementSlice';

export default combineReducers({
  userSlice,
  commonSlice,
  requirementSlice,
});
