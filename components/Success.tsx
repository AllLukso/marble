import styles from "../styles/Main.module.css";
import { VStack, Box, Text } from "@chakra-ui/react";
import SuccessLottie from "@components/SuccessLottie";
import { PageStateType } from "@components/Vault";

type SuccessContainerProps = {
  type: "crypto" | "nft" | "vault";
  label: string;
  pageState?: PageStateType;
};

const SuccessContainer = ({
  type,
  label,
  pageState,
}: SuccessContainerProps) => {
  let containerStyle = styles.detailContainer;
  let subtitleContainerStyle = styles.sentContainerSubtitle;
  let title = "Successfully sent!";

  switch (type) {
    case "crypto":
      containerStyle = styles.detailContainer;
      break;
    case "nft":
      containerStyle = styles.NFTdetailContainer;
      subtitleContainerStyle = styles.NFTSubtitle;
      break;
    case "vault":
      containerStyle = styles.VaultSuccessDetailContainer;
      break;
  }

  switch (pageState) {
    case PageStateType.Deposit:
      title = "Successfully deposited!";
      break;
    case PageStateType.Withdraw:
      title = "Successfully withdrawn!";
      break;
    case PageStateType.Detail:
      title = "Successfully claimed!";
      break;
    case PageStateType.Create:
      title = "Successfully created!";
      break;
    case PageStateType.Transfer:
      title = "Successfully transferred!";
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
          <Text className={subtitleContainerStyle}>{label}</Text>
          <Text className={styles.sentContainerFooter}>
            It may take up to ~2 min for the transaction to complete
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default SuccessContainer;
