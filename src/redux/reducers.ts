import { combineReducers } from 'redux';
import { firebaseReducer, FirebaseReducer } from 'react-redux-firebase';
import giftCards, { GiftCardState } from './blinksky/index';

// Optional: If you use the user profile option
interface Profile {
  name: string;
  email: string;
  phone: string;
}

// Optional: You can define the schema of your Firebase Redux store.
// This will give you type-checking for state.firebase.data.todos and state.firebase.ordered.todos
interface Schema {
  events: Event;
}

// with both reducer types
export interface RootState {
  firebase: FirebaseReducer.Reducer<Profile, Schema>;
  giftCards: GiftCardState;
}

// with only Profile type
// interface RootState {
//   firebase: FirebaseReducer.Reducer<Profile>;
// }

// with only Schema type
// interface RootState {
//   firebase: FirebaseReducer.Reducer<{}, Schema>;
// }

// without reducer types
// interface RootState {
//   firebase: FirebaseReducer.Reducer;
// }

export const rootReducer = combineReducers<RootState>({
  firebase: firebaseReducer,
  giftCards,
});
