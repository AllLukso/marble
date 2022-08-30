import { VStack, Text, Button } from "@chakra-ui/react";
import styles from "../styles/Landing.module.css";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Landing = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <VStack>
      <Text className={styles.title}>Welcome to Marble</Text>
      <Text className={styles.subtitle}>
        Connect your Universal Profile to access to your wallet
      </Text>
      <Button className={styles.connectButton} onClick={() => connect()}>
        CONNECT PROFILE{" "}
      </Button>
    </VStack>
  );
};

export default Landing;
