import { Box } from "@chakra-ui/react"

export type TBlockTypes = 'snake' | 'food' | 'blank';

type BlockProps = {
    type: TBlockTypes,
    idx: any
}

const Block = ({ type, idx }: BlockProps) => {
    return (
        <Box w='10px' h='10px' data-coords={idx} bg={type === 'snake' ? 'gray.500' : type === 'food' ? 'orange' : 'black'} datatype={type} />
    )
}

export default Block
