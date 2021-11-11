import type { NextPage } from 'next';
import { Stack, Flex, Box } from '@chakra-ui/react';
import Board from '../components/Snake/Board';

const Home: NextPage = () => {
  return (
    <Flex
      align='center'
      justify='center'
      minH='100vh'
      >
      <Board />
    </Flex>
  )
}

export default Home;
