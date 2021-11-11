import { Box } from "@chakra-ui/react"
import { TCell } from "../../types"

type CellProps = {
    type: TCell,
    idx: any
}

const Cell = ({ type, idx }: CellProps) => {
    return (
        <Box w='10px' h='10px' data-coords={idx} bg={type === 'snake' ? 'gray.500' : type === 'food' ? 'orange' : 'black'} datatype={type} />
    )
}

export default Cell
