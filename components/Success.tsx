import styles from "../styles/Main.module.css";
import { VStack, Box, Text } from "@chakra-ui/react";
import SuccessLottie from "@components/SuccessLottie";

type SuccessContainerProps = {
  type: "crypto" | "nft" | "vault";
  label: string;
};

const SuccessContainer = ({ type, label }: SuccessContainerProps) => {
  let containerStyle = styles.detailContainer;
  let title = "Successfully Sent!";

  switch (type) {
    case "crypto":
      containerStyle = styles.detailContainer;
      break;
    case "nft":
      containerStyle = styles.NFTdetailContainer;
      break;
    case "vault":
      containerStyle = styles.VaultDetailContainer;
      title = "Successfully Created!";
      break;
  }

  return (
    <VStack className={containerStyle}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      <VStack className={styles.sentContainer}>
        <VStack className={styles.sentContainerLottie}>
          <SuccessLottie />
        </VStack>
        <VStack className={styles.sentContainerTextContainer}>
          <Text className={styles.sentContainerTitle}>{title}</Text>
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
