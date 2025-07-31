import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext'; // Create this file as shown earlier

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NovaShop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UserProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </UserProvider>
    </>
  );
}

