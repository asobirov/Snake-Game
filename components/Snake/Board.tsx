import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";

import {
    Grid,
    Button,
    Code,
    IconButton,
    Stack,
    Flex,
    NumberInputField,
    NumberInput,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from "@chakra-ui/react"
import Cell from "./Cell"
import { TCell, TCoordinates, TDirection } from "../../types";
import { spawnFood } from "../../lib/redux/slices/foodSlice";
import { AppState } from "../../lib/redux/store";
import { moveSnake, resetSnake, setDirection } from "../../lib/redux/slices/snakeSlice";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, FingerprintCircled, Cancel } from "iconoir-react";

const Board = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const dispatch = useDispatch();

    const food = useSelector((state: AppState) => state.food);
    const foodRef = useRef(food)
    const { snake, tail, head, direction } = useSelector((state: AppState) => state.snake);
    const snakeRef = useRef(snake);
    const headRef = useRef(head);
    const direactionRef = useRef(direction);

    const [grid, setGrid] = useState<TCell[][] | null>(null);
    const [size, setSize] = useState<number>(50);
    const [speed, setSpeed] = useState<number>(100);

    const [start, setStart] = useState(false);
    const [lost, setLost] = useState(false);

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
        snakeRef.current = snake;
        headRef.current = head;
        foodRef.current = food;
        if (!lost) {
            updateGrid();
        }
    }, [snake, food, head]);

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

    const checkSelfCannibalism = (snake: TCoordinates[]) => {
        let hash: any = {};
        let hasDuplicate = false;
        snake.forEach((val) => {
            if (hash[val.x.toString()] === val.y) {
                hasDuplicate = true;
                return;
            }
            hash[val.x.toString()] = val.y;
        });
        console.log(hash);
        return hasDuplicate;
    }

    const handleMoveSnake = () => {
        if (lost) {
            return;
        }
        const snake = snakeRef.current;
        const head = headRef.current;
        const food = foodRef.current;


        if (head.x < 0 || head.y < 0) {
            endGame(`head(${JSON.stringify(head)}) <= 0`);
            return;
        }
        if (head.x >= size || head.y >= size) {
            endGame('head >= size');
            return;
        }
        if (head.x === food.x && head.y === food.y) {
            dispatch(spawnFood({ max: size }));
            dispatch(moveSnake({ cell: "food", max: size }));
            return;
        }

        dispatch(moveSnake({ cell: undefined, max: size }));
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
        <Stack
            direction='row'
            spacing={10}
            w='full'
            justify='center'
        >
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
            <Stack
                direction='column'
                spacing='16'
                align='center'
                justify='flex-end'
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
                            size='lg'
                            onClick={() => handleKeyDown({ key: 'ArrowUp' })}
                            aria-label='up'
                            isActive={direction === 'up'}
                            disabled={!start || lost}
                            icon={<ArrowUp />}
                        />
                    </Flex>
                    <Stack direction='row'>
                        <IconButton
                            size='lg'
                            onClick={() => handleKeyDown({ key: 'ArrowLeft' })}
                            aria-label='left'
                            isActive={direction === 'left'}
                            disabled={!start || lost}
                            icon={<ArrowLeft />}
                        />
                        <IconButton
                            size='lg'
                            onClick={() => handleKeyDown({ key: 'ArrowDown' })}
                            aria-label='down'
                            isActive={direction === 'down'}
                            disabled={!start || lost}
                            icon={<ArrowDown />}
                        />
                        <IconButton
                            size='lg'
                            onClick={() => handleKeyDown({ key: 'ArrowRight' })}
                            aria-label='right'
                            isActive={direction === 'right'}
                            disabled={!start || lost}
                            icon={<ArrowRight />}
                        />
                    </Stack>
                </Stack>
                <Stack direction='row'>
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
            <IconButton
                aria-label='Open Grid States'
                pos='fixed'
                top={6}
                right={6}
                icon={<FingerprintCircled />}
                onClick={onOpen}
            />
            <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg='black' py={2}>
                    <DrawerHeader
                        display='flex'
                        flexDirection='row'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        Board states:<DrawerCloseButton size='lg' icon={<Cancel />} pos='unset' />
                    </DrawerHeader>
                    <DrawerBody>
                        <Stack direction='row' spacing={10} mt={6}>
                            <Code p={3} colorScheme='black'>
                                Food: {JSON.stringify(food)}
                                <br />
                                Snake: {JSON.stringify(snake)}
                            </Code>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Stack >
    )
}

export default Board
