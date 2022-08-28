import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useAccount } from "wagmi";
import useIssuedTokens from "../hooks/useIssuedTokens";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { tokens, isLoading } = useIssuedTokens(address);

  console.log("tokens: ", tokens);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <ConnectButton />
      </main>
    </div>
  );
};

export default Home;
