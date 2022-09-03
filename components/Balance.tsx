import styles from "../styles/Main.module.css";
import { VStack, HStack, Text, Button } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { FaExchangeAlt, FaFaucet, FaMoneyCheckAlt } from "react-icons/fa";
import { abridgeAddress } from "@utils/helpers";
import { useState } from "react";
import { useLuksoWeb3 } from "./LuksoWeb3Provider";

type BalanceContainerProps = {
  address?: string;
  userProfile: any;
};

const BalanceContainer = ({ address, userProfile }: BalanceContainerProps) => {
  const { balance } = useLuksoWeb3();

  const [copied, setCopied] = useState(false);
  if (!address || !userProfile) return null;

  async function handleCopy() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <HStack className={styles.balanceContainer}>
      <VStack className={styles.balanceContainerLeftSection}>
        <Text className={styles.balanceContainerTitle}>Your LYX Balance</Text>
        <Text className={styles.balanceContainerBalance}>
          {balance ? balance : "0"} LYX
        </Text>
      </VStack>
      <VStack className={styles.balanceContainerRightSection} gap={1}>
        <HStack
          cursor="pointer"
          onClick={handleCopy}
          className={styles.copyAddressContainer}
        >
          <CopyIcon color="white" />
          <Text className={styles.balanceContainerAddress}>
            {abridgeAddress(address)}
          </Text>
          {copied && (
            <VStack className={styles.copiedPopover}>
              <Text>Copied!</Text>
            </VStack>
          )}
        </HStack>
        <HStack className={styles.balanceContainerButtonList}>
          <a
            href="https://faucet.l16.lukso.network/"
            target="_blank"
            rel="noreferrer"
          >
            <Button className={styles.balanceContainerButton}>
              <FaFaucet color="white" size="1rem" />
              <Text className={styles.balanceContainerButtonText}>Drip</Text>
            </Button>
          </a>
          <HStack className={styles.balanceContainerButtonList}>
            <a
              href="https://www.kucoin.com/trade/LYXE-USDT?spm=kcWeb.B1homepage.Header4.1"
              target="_blank"
              rel="noreferrer"
            >
              <Button className={styles.balanceContainerButton}>
                <FaMoneyCheckAlt color="white" size="1rem" />
                <Text className={styles.balanceContainerButtonText}>Buy</Text>
              </Button>
            </a>
            <a
              href="https://coinmarketcap.com/dexscan/ethereum/0xd583d0824ed78767e0e35b9bf7a636c81c665aa8"
              target="_blank"
              rel="noreferrer"
            >
              <Button className={styles.balanceContainerButton}>
                <FaExchangeAlt color="white" size="1rem" />
                <Text className={styles.balanceContainerButtonText}>Swap</Text>
              </Button>
            </a>
          </HStack>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default BalanceContainer;
