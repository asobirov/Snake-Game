import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCell, TCoordinates, TDirection } from "../../../types";

type TOffset = {
  x: number;
  y: number;
};

const initialState: {
  snake: TCoordinates[];
  head: TCoordinates;
  tail: TCoordinates | undefined;
  direction: TDirection;
} = {
  snake: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ],
  head: { x: 1, y: 0 },
  tail: undefined,
  direction: "right",
};

const snakeSlice = createSlice({
  name: "snake",
  initialState,
  reducers: {
    moveSnake(state, action: PayloadAction<TCell | undefined>) {
      let head = { ...state.snake[state.snake.length - 1] };
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
      state.head = head;
      if (!(head.x < 0 || head.y < 0)) {
        state.snake.push(head);
        if (action.payload !== "food") {
          state.tail = state.snake.shift();
        }
      }
    },
    setDirection(state, action: PayloadAction<TDirection>) {
      state.direction = action.payload;
    },
    resetSnake(state) {
      state.snake = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ];
      state.head = { x: 1, y: 0 };
      state.tail = undefined;
      state.direction = "right";
    },
  },
});

export const { moveSnake, resetSnake, setDirection } = snakeSlice.actions;
export default snakeSlice.reducer;
