// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import cities from './apps/cities';
import user from './apps/user';

export const store = configureStore({
  reducer: {
    cities,
    user,
  },
});

