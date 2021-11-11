import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

// import boardSlice from "./slices/boardSlice";
import foodSlice from "./slices/foodSlice";
import snakeSlice from "./slices/snakeSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
    //   board: boardSlice,
      snake: snakeSlice,
      food: foodSlice
    },
  });
};

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
