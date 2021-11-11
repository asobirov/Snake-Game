import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCoordinates, TDirection } from "../../../types";

type TOffset = {
  x: number;
  y: number;
};

const initialState: {
  snake: TCoordinates[];
  tail: TCoordinates | undefined;
  direction: TDirection;
} = {
  snake: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ],
  tail: undefined,
  direction: "right",
};

const snakeSlice = createSlice({
  name: "snake",
  initialState,
  reducers: {
    moveSnake(state) {
      let head = { ...state.snake[state.snake.length - 1] };
      console.log("Move to", state.direction);
      switch (state.direction) {
        case "right":
          head = { x: head.x + 1, y: head.y };
          break;

        case "left":
          head = { x: head.x - 1, y: head.y };
          break;

        case "up":
          head = { x: head.x, y: head.y - 1 };
          break;

        case "down":
          head = { x: head.x, y: head.y + 1 };
          break;
      }
      state.snake.push(head);
      state.tail = state.snake.shift();
    },
    resetSnake(state) {
      state = {
        snake: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
        tail: undefined,
        direction: "right",
      };
    },
    setDirection(state, action: PayloadAction<TDirection>) {
      state.direction = action.payload;
    },
  },
});

export const { moveSnake, resetSnake, setDirection } = snakeSlice.actions;
export default snakeSlice.reducer;
