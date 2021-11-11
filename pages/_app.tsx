import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux'

import store from '../lib/redux/store';

import theme from '../styles/theme';

import 'focus-visible/dist/focus-visible';

import "@fontsource/poppins"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import "@fontsource/poppins/800.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>
    </ChakraProvider>
  )
}

export default MyApp
