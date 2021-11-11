import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCell, TCoordinates } from "../../../types";

type TSpawFood = {
  max: number;
  grid?: TCell[][];
};

function initFoodCoords(): TCoordinates {
  let min = Math.ceil(0);
  let max = Math.floor(50);
  return {
    x: Math.floor(Math.random() * (max - min + 1) + min),
    y: Math.floor(Math.random() * (max - min + 1) + min),
  };
}

const initialState: TCoordinates = initFoodCoords();

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    spawnFood(state, action: PayloadAction<TSpawFood>) {
      let min = Math.ceil(0);
      let max = Math.floor(action.payload.max);
      state = {
        x: Math.floor(Math.random() * (max - min + 1) + min),
        y: Math.floor(Math.random() * (max - min + 1) + min),
      };
    },
  },
});

export const { spawnFood } = foodSlice.actions;
export default foodSlice.reducer;
