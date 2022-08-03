import { configureStore } from "@reduxjs/toolkit";
import guessesReducer from "../features/guessesSlice";
import answerReducer from "../features/answerSlice";

export const store = configureStore({
  reducer: {
    submittedGuesses: guessesReducer,
    answer: answerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
