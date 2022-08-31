import styles from "../styles/Main.module.css";
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Image,
  Input,
  Switch,
  SimpleGrid,
} from "@chakra-ui/react";
import { CopyIcon, RepeatIcon } from "@chakra-ui/icons";
import { FaGithub, FaRegPaperPlane, FaBinoculars } from "react-icons/fa";

const BalanceContainer = () => {
  return (
    <HStack className={styles.balanceContainer}>
      <VStack className={styles.balanceContainerLeftSection}>
        <Text className={styles.balanceContainerTitle}>Your Total Balance</Text>
        <Text className={styles.balanceContainerBalance}>$12,891.90</Text>
      </VStack>
      <VStack className={styles.balanceContainerRightSection}>
        <HStack>
          <CopyIcon color="white" />
          <Text className={styles.balanceContainerAddress}>0x2dA9...796e</Text>
        </HStack>
        <HStack className={styles.balanceContainerButtonList}>
          <Button className={styles.balanceContainerButton}>
            <FaGithub color="white" />
            <Text className={styles.balanceContainerButtonText}>Buy</Text>
          </Button>
          <Button className={styles.balanceContainerButton}>
            <FaGithub color="white" />
            <Text className={styles.balanceContainerButtonText}>Send</Text>
          </Button>
          <Button className={styles.balanceContainerButton}>
            <FaGithub color="white" />
            <Text className={styles.balanceContainerButtonText}>Swap</Text>
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default BalanceContainer;
