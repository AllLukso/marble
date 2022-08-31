import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Web3 from "web3";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { InjectedConnector } from "wagmi/connectors/injected";

declare global {
  interface Window {
    web3: any;
  }
}

const LuksoL16Chain: Chain = {
  id: 2828,
  name: "L16",
  network: "lukso",
  nativeCurrency: {
    decimals: 18,
    name: "Lukso",
    symbol: "LYXt",
  },
  rpcUrls: {
    default: "https://rpc.l16.lukso.network",
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.execution.l16.lukso.network",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [LuksoL16Chain],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_ALCHEMY_ID,
    }),
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== LuksoL16Chain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My Lusko Dapp",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

if (typeof window !== "undefined") {
  // Client-side-only code
  window.web3 = new Web3(Web3.givenProvider);
}

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

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // prevent hydration UI bug: https://blog.saeloun.com/2021/12/16/hydration.html
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <Navbar />
        <Component {...pageProps} />
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
