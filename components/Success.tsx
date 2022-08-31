import styles from "../styles/Main.module.css";
import { VStack, Box, Text } from "@chakra-ui/react";
import SuccessLottie from "@components/SuccessLottie";

type SuccessContainerProps = {
  isNFT: boolean;
  label: string;
};

const SuccessContainer = ({ isNFT, label }: SuccessContainerProps) => {
  return (
    <VStack
      className={!isNFT ? styles.detailContainer : styles.NFTdetailContainer}
    >
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      <VStack className={styles.sentContainer}>
        <VStack className={styles.sentContainerLottie}>
          <SuccessLottie />
        </VStack>
        <VStack className={styles.sentContainerTextContainer}>
          <Text className={styles.sentContainerTitle}>Successfully Sent!</Text>
          <Text className={styles.sentContainerSubtitle}>{label}</Text>
          <Text className={styles.sentContainerFooter}>
            It may take up to ~2 min for the transaction to complete
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default SuccessContainer;
