import styles from "../styles/Main.module.css";
import { VStack, Box, Text, Link } from "@chakra-ui/react";
import withTransition from "@components/withTransition";

type ComingSoonContainerProps = {
  title: string;
};

const ComingSoonContainer = ({ title }: ComingSoonContainerProps) => {
  return (
    <VStack className={styles.comingSoonContainer}>
      <Box className={styles.tokenContainerTitleBox}>
        <Text className={styles.tokenContainerTitle}>{title}</Text>
      </Box>
      <VStack className={styles.comingSoonContentContainer}>
        <Text className={styles.comingSoonText}>
          This feature will be a part of a future release with LUKSO Mainnet!
        </Text>
        <Link href="https://twitter.com/iamminci" isExternal>
          <Text className={styles.comingSoonText}>
            If you'd like to help contribute, please reach out at @iamminci
          </Text>
        </Link>
        <Box h="4rem"></Box>
      </VStack>
    </VStack>
  );
};

export default withTransition(ComingSoonContainer);
