import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnswerState {
  value: string;
}

const initialState: AnswerState = {
  value: "",
};

export const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    changeAnswer: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { changeAnswer } = answerSlice.actions;

export default answerSlice.reducer;
