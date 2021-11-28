import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCell, TCoordinates } from "../../../types";

type TSpawFood = {
  max: number;
  grid?: TCell[][];
};

function initFoodCoords(): any {
  return {
    x: null,
    y: null,
  };
}

const initialState: TCoordinates = initFoodCoords();

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    spawnFood(state, action: PayloadAction<TSpawFood>) {
      const { max } = action.payload;
      state.x = Math.floor(Math.random() * max);
      state.y = Math.floor(Math.random() * max);
    },
  },
});

export const { spawnFood } = foodSlice.actions;
export default foodSlice.reducer;
