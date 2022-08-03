import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuessesState {
  value: string[];
}

export interface GuessPayload {
  guess: string;
  number: number;
}

const initialState: GuessesState = {
  value: Array(6).fill(null),
};

export const guessesSlice = createSlice({
  name: "submittedGuesses",
  initialState,
  reducers: {
    addGuess: (state, action: PayloadAction<GuessPayload>) => {
      state.value[action.payload.number] = action.payload.guess;
    },
    clearGuess: (state) => {
      state.value = Array(6).fill(null);
    },
  },
});

export const { addGuess, clearGuess } = guessesSlice.actions;

export default guessesSlice.reducer;
