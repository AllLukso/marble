import styles from "../styles/Main.module.css";
import { HStack, VStack, Box, Text } from "@chakra-ui/react";
import PieChart from "@components/PieChart";
import Gradient from "javascript-color-gradient";

type OverviewContainerProps = {
  tokens: any;
};

export const OverviewCryptoContainer = ({ tokens }: OverviewContainerProps) => {
  const gradientArray = new Gradient()
    .setColorGradient("#3F2CAF", "e9446a")
    .getColors();

  const aggregateBalance = tokens.reduce((acc, token) => {
    return acc + Number(token.balance);
  }, 0);

  const data = tokens.map((token, idx) => {
    return {
      label: token.symbol,
      value: Number(token.balance),
      color: gradientArray[idx],
    };
  });

  return (
    <VStack className={styles.detailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      <PieChart data={data} />
      <VStack className={styles.scoreListContainer}>
        {data.map(({ label, value, color }, idx) => (
          <HStack key={idx} className={styles.scoreContainer}>
            <Text className={styles.scoreTitleLabel}>{label}</Text>
            <Box className={`${styles.scoreBarContainer}`}>
              <Box
                style={{
                  backgroundColor: color,
                  width: `${((value / aggregateBalance) * 100).toFixed(0)}%`,
                }}
                className={`${styles.scoreBar}`}
              ></Box>
            </Box>
            <Text className={styles.scoreLabel}>
              {(value / aggregateBalance).toFixed(2)}
            </Text>
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

export const OverviewVaultContainer = ({ data }: OverviewContainerProps) => {
  return (
    <VStack className={styles.VaultDetailContainer}>
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
            <Text className={styles.vaultScoreTitleLabel}>{name}</Text>
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
