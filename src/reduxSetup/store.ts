// import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from './voterInfo';

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Default to localStorage
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import counterReducer from './voterInfo';
import { Provider } from 'react-redux';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, counterReducer);

// Create the store
export const store = configureStore({
  reducer: {
    counter: persistedReducer,
  },
});

// Persistor for the store
export const persistor = persistStore(store);
