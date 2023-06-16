// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import cities from './apps/cities';

export const store = configureStore({
  reducer: {
    cities,
  },
});

