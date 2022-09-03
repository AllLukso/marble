import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { LuksoWeb3Provider } from "@components/LuksoWeb3Provider";

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        fontFamily: "Inter",
        lineHeight: "base",
      },
    }),
  },
});

function MyApp({ Component, pageProps, router }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // prevent hydration UI bug: https://blog.saeloun.com/2021/12/16/hydration.html
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ChakraProvider theme={theme}>
      <LuksoWeb3Provider>
        <Navbar />
        <Component {...pageProps} key={router.route} />
      </LuksoWeb3Provider>
    </ChakraProvider>
  );
}

export default MyApp;
