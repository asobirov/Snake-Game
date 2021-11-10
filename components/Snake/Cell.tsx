import { Box } from "@chakra-ui/react"

export type TBlockTypes = 'snake' | 'food' | 'blank';

type BlockProps = {
    type: TBlockTypes
}

const Block = ({ type }: BlockProps) => {
    return (
        <Box w='10px' h='10px' bg={type === 'snake' ? 'gray.500' : type === 'food' ? 'orange' : 'black'} />
    )
}

export default Block
