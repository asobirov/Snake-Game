import { useState } from "react"
import { Grid } from "@chakra-ui/react"
import Cell, { TBlockTypes } from "./Cell"

const Board = () => {
    const [size, setSize] = useState<number>(50)
    const [board, setBoard] = useState<TBlockTypes[][]>(() => Array.from({ length: size }, () => Array.from({ length: size }, () => "blank")));

    const displaySnake = () => {

    }
    return (
        <Grid
            templateColumns={`repeat(${size}, 1fr)`}
            templateRows={`repeat(${size}, 1fr)`}
            gap='2px'
            p='8px'
            border='1px'
            w='min-content'
            borderColor='whiteAlpha.700'
        >
            {board.map(row => {
                return row.map((cell, key) => (
                    <Cell key={key} type={cell} />
                ))
            })}
        </Grid>
    )
}

export default Board
