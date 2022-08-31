import styles from "../styles/Main.module.css";
import { HStack, VStack, Box, Text } from "@chakra-ui/react";
import PieChart from "@components/PieChart";

type OverviewContainerProps = {
  data: any;
};

export const OverviewCryptoContainer = ({ data }: OverviewContainerProps) => {
  return (
    <VStack className={styles.detailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      <PieChart
        data={[
          { title: "One", value: 10, color: "#E38627" },
          { title: "Two", value: 15, color: "#C13C37" },
          { title: "Three", value: 20, color: "#6A2135" },
        ]}
      />
      <VStack className={styles.scoreListContainer}>
        {data.map(({ name, balance }, idx) => (
          <HStack key={idx} className={styles.scoreContainer}>
            <Text className={styles.scoreTitleLabel}>{name}</Text>
            <Box className={`${styles.scoreBarContainer}`}>
              <Box className={`${styles.scoreBar}`}></Box>
            </Box>
            <Text className={styles.scoreLabel}>8.6</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export const OverviewNFTContainer = ({ data }: OverviewContainerProps) => {
  return (
    <VStack className={styles.NFTdetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      <PieChart
        data={[
          { title: "One", value: 10, color: "#E38627" },
          { title: "Two", value: 15, color: "#C13C37" },
          { title: "Three", value: 20, color: "#6A2135" },
        ]}
      />
      <VStack className={styles.scoreListContainer}>
        {data.map(({ name, balance }, idx) => (
          <HStack key={idx} className={styles.scoreContainer}>
            <Text className={styles.scoreTitleLabel}>{name}</Text>
            <Box className={`${styles.NFTscoreBarContainer}`}>
              <Box className={`${styles.scoreBar}`}></Box>
            </Box>
            <Text className={styles.scoreLabel}>8.6</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};
