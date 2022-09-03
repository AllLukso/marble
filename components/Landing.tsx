import styles from "../styles/Landing.module.css";
import { VStack, Text, Button } from "@chakra-ui/react";
import { useLuksoWeb3 } from "./LuksoWeb3Provider";
import withTransition from "@components/withTransition";

const Landing = () => {
  const { web3, setAddress } = useLuksoWeb3();

  async function connectWallet() {
    if (!web3) return;

    try {
      const accounts = await web3.eth.requestAccounts();
      setAddress(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <VStack>
      <Text className={styles.title}>Welcome to Marble</Text>
      <Text className={styles.subtitle}>
        Connect your Universal Profile to access to your wallet
      </Text>
      <Button className={styles.connectButton} onClick={connectWallet}>
        CONNECT PROFILE{" "}
      </Button>
    </VStack>
  );
};

export default withTransition(Landing);
