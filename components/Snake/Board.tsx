import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";

import { Grid, Button, IconButton, Stack, Flex, NumberInputField, NumberInput, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Slider, SliderFilledTrack, SliderTrack, SliderThumb } from "@chakra-ui/react"
import Cell from "./Cell"
import { TCell, TDirection } from "../../types";
import { spawnFood } from "../../lib/redux/slices/foodSlice";
import { AppState } from "../../lib/redux/store";
import { moveSnake, resetSnake, setDirection } from "../../lib/redux/slices/snakeSlice";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "iconoir-react";

const Board = () => {
    const dispatch = useDispatch();

    const food = useSelector((state: AppState) => state.food);
    const { snake, tail, direction } = useSelector((state: AppState) => state.snake);
    const direactionRef = useRef(direction);

    const [grid, setGrid] = useState<TCell[][] | null>(null);
    const [size, setSize] = useState<number>(50);
    const [speed, setSpeed] = useState<number>(500);

    const [start, setStart] = useState(false);

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
        dispatch(setDirection(dir));
        direactionRef.current = dir
    }

    const handleKeyDown = ({ key }: any) => {
        const direction = direactionRef.current;
        console.log(key);
        switch (key) {
            case "ArrowDown":
                if (direction !== "up") {
                    handleDirectionChange('down');
                }
                break;
            case "ArrowRight":
                if (direction !== "left") {
                    handleDirectionChange('right');
                }
                break;
            case "ArrowUp":
                if (direction !== "down") {
                    handleDirectionChange('up');
                }
                break;
            case "ArrowLeft":
                if (direction !== "right") {
                    handleDirectionChange('left');
                }
                break;
        }
    }

    useEffect(() => {
        let interval: any;
        if (start) {
            interval = setInterval(() => {
                dispatch(moveSnake());
            }, speed)
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        }
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
            <Stack
                direction='row'
                spacing='12'
                align='center'
                mt={6}>
                <Button
                    onClick={() => setStart(!start)}
                    minW={24}
                >{start ? 'Stop' : 'Start'}</Button>
                <Stack>
                    <Flex justify='center'>
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowUp' })}
                            aria-label='up'
                            isActive={direction === 'up'}
                            disabled={!start}
                            icon={<ArrowUp />}
                        />
                    </Flex>
                    <Stack direction='row'>
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowLeft' })}
                            aria-label='left'
                            isActive={direction === 'left'}
                            disabled={!start}
                            icon={<ArrowLeft />}
                        />
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowDown' })}
                            aria-label='down'
                            isActive={direction === 'down'}
                            disabled={!start}
                            icon={<ArrowDown />}
                        />
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowRight' })}
                            aria-label='right'
                            isActive={direction === 'right'}
                            disabled={!start}
                            icon={<ArrowRight />}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

export default Board
