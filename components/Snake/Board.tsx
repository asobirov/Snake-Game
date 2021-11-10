import { useState, useEffect } from "react"
import { Grid } from "@chakra-ui/react"
import Cell, { TBlockTypes } from "./Cell"

type Coordinates = {
    x: number,
    y: number
}
type Direction = 'up' | 'down' | 'left' | 'right';

const Board = () => {
    const [size, setSize] = useState<number>(50);
    const [speed, setSpeed] = useState<number>(200);

    const getRandomCoordinates = (max: number = size - 1): Coordinates => {
        let min = Math.ceil(0);
        max = Math.floor(max);
        return {
            x: Math.floor(Math.random() * (max - min + 1) + min),
            y: Math.floor(Math.random() * (max - min + 1) + min)
        }
    }
    const [food, setFood] = useState<Coordinates>(getRandomCoordinates)

    const initBoard = () => {
        const _board: TBlockTypes[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => "blank"));

        const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];

        _board[food.x][food.y] = 'food'
        snake.forEach(cell => {
            _board[cell.x][cell.y] = 'snake'
        })

        return _board
    }
    const [board, setBoard] = useState<TBlockTypes[][]>(initBoard);

    const [snake, setSnake] = useState<Coordinates[]>(() => [{ x: 0, y: 0 }, { x: 1, y: 0 }]);
    const [direction, setDirection] = useState<Direction>('right');

    const handleKeyDown = (e: any) => {
        const key = e.keyCode;

        switch (key) {

            case 40:
                setDirection('down');
                break;
            case 39:
                setDirection('right');
                break;
            case 38:
                setDirection('up');
                break;
            case 37:
                setDirection('left');
                break;

        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
    }, [])

    const moveSnake = () => {
        const _snake: Coordinates[] = [...snake];
        let head = _snake[_snake.length - 1];

        switch (direction) {
            case 'right':
                head = { x: head.x + 1, y: head.y };
                break;

            case 'left':
                head = { x: head.x - 1, y: head.y }
                break;

            case 'up':
                head = { x: head.x, y: head.y - 1 }
                break;

            case 'down':
                head = { x: head.x, y: head.y + 1 }
                break;

        }
        _snake.push(head);
        const tail = _snake.shift()!;
        setSnake(_snake);

        const _board = [...board];
        _board[tail.x][tail.y] = 'blank'
        setBoard(_board);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            moveSnake();
        }, speed);
        return () => clearInterval(interval)
    }, [snake])

    const updateBoard = ({ snake, food }: { snake?: Coordinates[], food?: Coordinates }) => {
        const _board = board;

        if (food) {
            _board[food.x][food.y] = 'food'
        }

        if (snake) {
            snake.forEach(cell => {
                _board[cell.x][cell.y] = 'snake'
            })
        }
        return _board;
    }

    useEffect(() => {
        setBoard(updateBoard({ snake }));
    }, [snake])
    return (
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
            {board.map((column, rK) => {
                return column.map((cell, key) => (
                    <Cell key={key} idx={`${rK}:${key}`} type={cell} />
                ))
            })}
        </Grid>
    )
}

export default Board
