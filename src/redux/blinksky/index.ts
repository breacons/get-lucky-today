import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';

import { GiftCard } from '../../interfaces/blinksky';
import { RootState } from '../reducers';
import { firebaseApiUrl } from '../../config';
import axios from 'axios';

export const getGiftCards = createAsyncThunk('giftCards/get-all', async () => {
  const response = await axios.post(`${firebaseApiUrl}/catalog`);
  return response.data;
});

function compareDesc(date: Date, date2: Date) {
  return 0;
}

export const giftCardsAdapter = createEntityAdapter<GiftCard>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (card) => {
    return card.code;
  },
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.caption.localeCompare(b.caption),
});

type ExtraState = {
  error: Error | null;
  isLoading: boolean;
};
export type GiftCardState = EntityState<GiftCard> & ExtraState;

const initialState: GiftCardState = giftCardsAdapter.getInitialState<ExtraState>({
  isLoading: false,
  error: null,
});

const giftCardsSlice = createSlice({
  name: 'giftCards',
  initialState,
  reducers: {},
  extraReducers: {
    [getGiftCards.pending.toString()]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [getGiftCards.fulfilled.toString()]: (state, action: PayloadAction<GiftCard[]>) => {
      giftCardsAdapter.addMany<GiftCardState>((state as unknown) as GiftCardState, action.payload);
      state.isLoading = false;
    },
    [getGiftCards.rejected.toString()]: (state) => {
      state.isLoading = false;
    },
  },
});

export const selectGiftCards = (state: RootState) => state.giftCards;

export const getGiftCardsLoading = createSelector(selectGiftCards, (state) => state.isLoading);

export const getGiftCardsError = createSelector(selectGiftCards, (state) => state.error);

export const giftCardSelectors = giftCardsAdapter.getSelectors(
  (state: RootState) => state.giftCards,
);

export const selectGiftCardEntities = giftCardsAdapter.getSelectors(
    (state: RootState) => state.giftCards,
).selectAll;


export default giftCardsSlice.reducer;
