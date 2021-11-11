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
    const foodRef = useRef(food)
    const { snake, tail, head, direction } = useSelector((state: AppState) => state.snake);
    const headRef = useRef(head);
    const direactionRef = useRef(direction);

    const [grid, setGrid] = useState<TCell[][] | null>(null);
    const [size, setSize] = useState<number>(50);
    const [speed, setSpeed] = useState<number>(369);

    const [start, setStart] = useState(false);
    const [lost, setLost] = useState(false);

    useEffect(() => {
        // return () => {
        //     dispatch(resetSnake());
        // }
    }, [])

    useEffect(() => {
        headRef.current = head;
        foodRef.current = food;
    }, [head, food])

    const addFood = (_grid: TCell[][]) => {
        dispatch(spawnFood({ max: size }));
        _grid[food.x][food.y] = 'food';

        return _grid
    }

    const initGrid = (): TCell[][] => {
        console.log('INIT');

        let _grid: TCell[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => "blank"))

        // dispatch(spawnFood({ max: size }));
        _grid[food.x][food.y] = 'food';

        // snake.forEach(cell => {  // FIX: Hardcoded, snake is falling one step behind
        [{ x: 0, y: 0 }, { x: 1, y: 0 }].forEach(cell => {
            _grid[cell.x][cell.y] = 'snake'
        })

        return _grid
    }

    const updateGrid = () => {
        let _grid: TCell[][]
        if (!grid) {
            _grid = initGrid();
        } else {
            _grid = JSON.parse(JSON.stringify(grid));

            _grid[food.x][food.y] = 'food';
            snake.forEach(cell => {
                _grid[cell.x][cell.y] = 'snake'
            });
            if (tail) {
                _grid[tail.x][tail.y] = 'blank'
            }
        }
        setGrid(_grid);
    }


    useEffect(() => {
        if (!lost) {
            updateGrid();
        }
    }, [snake]);

    const handleDirectionChange = (dir: TDirection) => {
        dispatch(setDirection(dir));
        direactionRef.current = dir
    }

    const handleKeyDown = ({ key }: any) => {
        const direction = direactionRef.current;
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

    const endGame = (reason: string) => {
        setStart(false);
        setLost(true);
        alert(`You lost!:( \nReason: ${reason || 'UNKOWN'}`);
    }

    const handleMoveSnake = () => {
        const head = headRef.current;
        const food = foodRef.current;
        if (head.x < 0 || head.y < 0) {
            endGame(`head(${JSON.stringify(head)}) <= 0`);
            return;
        }
        if (head.x >= size - 1 || head.y >= size - 1) {
            endGame('head >= size - 1 ');
            return;
        }
        if (head.x === food.x && head.y === food.y) {
            console.log('YUMMMY');
            dispatch(spawnFood({ max: size }));
            dispatch(moveSnake("food"));
            return;
        }
        dispatch(moveSnake());
    }

    useEffect(() => {
        let interval: any;
        if (start && !lost) {
            interval = setInterval(() => {
                handleMoveSnake()
            }, speed)
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [start, speed]);

    const reset = () => {
        dispatch(resetSnake());
        setStart(false);
        setGrid(initGrid());
        setLost(false);
    }

    return (
        <>
            <Grid
                templateColumns={`repeat(${size}, 1fr)`}
                templateRows={`repeat(${size}, 1fr)`}
                gap='2px'
                p='8px'
                w='min-content'
                border='1px'
                borderColor='whiteAlpha.700'
                borderRadius={'2xl'}
                boxShadow={lost ? 'rgba(229, 62, 62, 0.1) 0px 0px 20px 8px' : 'dark-lg'}
                gridAutoFlow='column'
                transition='all'
            >
                {grid && grid.map((column, rK) => {
                    return column.map((cell, key) => (
                        <Cell key={key} idx={`${rK}:${key}`} type={cell} />
                    ))
                })}
            </Grid>
            {JSON.stringify(snake)}
            {JSON.stringify(food)}
            <Stack
                direction='row'
                spacing='12'
                align='center'
                mt={6}>
                <Stack
                    shouldWrapChildren
                >
                    <NumberInput
                        size="lg"
                        maxW={28}
                        min={50}
                        max={2000}
                        step={50}
                        defaultValue={speed}
                        clampValueOnBlur={false}
                        isDisabled
                        onChange={(_, value) => setSpeed(value)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Stack>
                <Stack>
                    <Flex justify='center'>
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowUp' })}
                            aria-label='up'
                            isActive={direction === 'up'}
                            disabled={!start || lost}
                            icon={<ArrowUp />}
                        />
                    </Flex>
                    <Stack direction='row'>
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowLeft' })}
                            aria-label='left'
                            isActive={direction === 'left'}
                            disabled={!start || lost}
                            icon={<ArrowLeft />}
                        />
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowDown' })}
                            aria-label='down'
                            isActive={direction === 'down'}
                            disabled={!start || lost}
                            icon={<ArrowDown />}
                        />
                        <IconButton
                            onClick={() => handleKeyDown({ key: 'ArrowRight' })}
                            aria-label='right'
                            isActive={direction === 'right'}
                            disabled={!start || lost}
                            icon={<ArrowRight />}
                        />
                    </Stack>
                </Stack>
                <Stack>
                    <Button
                        onClick={() => setStart(!start)}
                        minW={24}
                        disabled={lost}
                        colorScheme={start ? 'red' : 'gray'}
                    >
                        {start ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                        onClick={() => reset()}
                        minW={24}
                    >
                        Reset
                    </Button>
                </Stack>
            </Stack>
        </>
    )
}

export default Board
