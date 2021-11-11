import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";

import { Grid, Button, IconButton, Stack, Flex, NumberInputField, NumberInput, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Slider, SliderFilledTrack, SliderTrack, SliderThumb } from "@chakra-ui/react"
import Cell from "./Cell"
import { TCell, TDirection } from "../../types";
import { spawnFood } from "../../lib/redux/slices/foodSlice";
import { AppState } from "../../lib/redux/store";
import { moveSnake, resetSnake, setDirection } from "../../lib/redux/slices/snakeSlice";
import { ArrowDown, ArrowUp } from "iconoir-react";

const Board = () => {
    const dispatch = useDispatch();

    const food = useSelector((state: AppState) => state.food);
    const { snake, tail } = useSelector((state: AppState) => state.snake);


    const [grid, setGrid] = useState<TCell[][] | null>(null);
    const [size, setSize] = useState<number>(50);
    const [speed, setSpeed] = useState<number>(500);

    useEffect(() => {
        return () => {
            console.log('RESET');
            dispatch(resetSnake());
        }
    }, [])

    const updateGrid = () => {
        let _grid: TCell[][]
        if (!grid) {
            _grid = Array.from({ length: size }, () => Array.from({ length: size }, () => "blank"))

            dispatch(spawnFood({ max: size }));
            _grid[food.x][food.y] = 'food';

            const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
            snake.forEach(cell => {
                _grid[cell.x][cell.y] = 'snake'
            })
        } else {
            _grid = JSON.parse(JSON.stringify(grid));

            _grid[food.x][food.y] = 'food';

            snake.forEach(cell => {
                _grid[cell.x][cell.y] = 'snake'
            });
            _grid[tail!.x][tail!.y] = 'blank'
        }
        setGrid(_grid);
    }


    useEffect(() => {
        updateGrid();
    }, [snake]);

    const handleDirectionChange = (dir: TDirection) => {
        console.log(dir);
        dispatch(setDirection(dir));
    }

    const handleKeyDown = (e: any) => {
        const key = e.keyCode;

        switch (key) {

            case 40:
                handleDirectionChange('down');
                break;
            case 39:
                handleDirectionChange('right');
                break;
            case 38:
                handleDirectionChange('up');
                break;
            case 37:
                handleDirectionChange('left');
                break;
        }
    }

    const [start, setStart] = useState(false);

    useEffect(() => {
        let interval: any;

        if (start) {
            interval = setInterval(() => {
                dispatch(moveSnake());
            }, speed)
            window.addEventListener('keydown', handleKeyDown);

        } else {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => clearInterval(interval);
    }, [start, speed]);

    return (
        <>
            <Grid
                templateColumns={`repeat(${size}, 1fr)`}
                templateRows={`repeat(${size}, 1fr)`}
                gap='2px'
                p='8px'
                border='1px'
                w='min-content'
                borderColor='whiteAlpha.700'
                gridAutoFlow='column'
            >
                {grid && grid.map((column, rK) => {
                    return column.map((cell, key) => (
                        <Cell key={key} idx={`${rK}:${key}`} type={cell} />
                    ))
                })}
            </Grid>
            <Stack direction='row' spacing='12' mt={6}>
                <Button onClick={() => setStart(!start)}>{start ? 'Stop' : 'Start'}</Button>
                <Stack>
                    <IconButton onClick={() => handleDirectionChange('down')} aria-label='up' icon={<ArrowDown />} />
                </Stack>
            </Stack>
        </>
    )
}

export default Board
