import styles from "@styles/Main.module.css";
import { HStack, VStack, Box, Text } from "@chakra-ui/react";
import PieChart from "@components/PieChart";
import Gradient from "javascript-color-gradient";
import withTransition from "./withTransition";
import { abridgeAddressPie } from "@utils/helpers";

type OverviewContainerProps = {
  tokens: any;
};

const CryptoContainer = ({ tokens }: OverviewContainerProps) => {
  const gradientArray = new Gradient()
    .setColorGradient("#3F2CAF", "e9446a")
    .getColors();

  const aggregateBalance = tokens.reduce((acc: any, token: any) => {
    return acc + Number(token.balance);
  }, 0);

  const data = tokens.map((token: any, idx: number) => {
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
      <Box className={styles.pieChartContainer}>
        <PieChart data={data} />
      </Box>
      <VStack className={styles.scoreListContainer}>
        {data.map(({ label, value, color }: any, idx: number) => (
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
              {((value / aggregateBalance) * 100).toFixed(0)}%
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export const OverviewCryptoContainer = withTransition(CryptoContainer);

const NFTContainer = ({ tokens }: OverviewContainerProps) => {
  const gradientArray = new Gradient()
    .setColorGradient("#3F2CAF", "e9446a")
    .getColors();

  const aggregateBalance = tokens.reduce((acc: any, token: any) => {
    return acc + Number(token.balance);
  }, 0);

  const data = tokens.map((token: any, idx: number) => {
    return {
      label: token.collectionSymbol,
      value: Number(token.balance),
      color: gradientArray[idx],
    };
  });

  return (
    <VStack className={styles.NFTdetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      <Box className={styles.pieChartContainer}>
        <PieChart data={data} />
      </Box>
      <VStack className={styles.scoreListContainer}>
        {data.map(({ label, value, color }: any, idx: number) => (
          <HStack key={idx} className={styles.scoreContainer}>
            <Text className={styles.NFTscoreTitleLabel}>{label}</Text>
            <Box className={`${styles.NFTscoreBarContainer}`}>
              <Box
                style={{
                  backgroundColor: color,
                  width: `${((value / aggregateBalance) * 100).toFixed(0)}%`,
                }}
                className={`${styles.scoreBar}`}
              ></Box>
            </Box>
            <Text className={styles.scoreLabel}>
              {((value / aggregateBalance) * 100).toFixed(0)}%
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export const OverviewNFTContainer = withTransition(NFTContainer);

type VaultContainerProps = {
  vaults: any;
};

const VaultContainer = ({ vaults }: VaultContainerProps) => {
  const gradientArray = new Gradient()
    .setColorGradient("#3F2CAF", "e9446a")
    .getColors();

  const aggregateBalance = vaults.reduce((acc: any, vault: any) => {
    return acc + Number(vault.balance);
  }, 0);

  const data = vaults.map((vault: any, idx: number) => {
    return {
      label: abridgeAddressPie(vault.address),
      value: Number(vault.balance),
      color: gradientArray[idx],
    };
  });

  return (
    <VStack className={styles.VaultDetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      {aggregateBalance === 0 ? (
        <VStack height="80%" justifyContent="center" alignItems="center">
          <Text color="white" fontFamily="Montserrat">
            All vault balances are empty.
          </Text>
        </VStack>
      ) : (
        <VStack>
          <Box className={styles.pieChartContainer}>
            <PieChart data={data} />
          </Box>
          <VStack className={styles.scoreListContainer}>
            {data.map(({ label, value, color }: any, idx: number) => {
              const percentage = ((value / aggregateBalance) * 100).toFixed(0);
              return (
                <HStack key={idx} className={styles.scoreContainer}>
                  <Text className={styles.vaultScoreTitleLabel}>{label}</Text>
                  <Box className={`${styles.NFTscoreBarContainer}`}>
                    <Box
                      style={{
                        backgroundColor: color,
                        width: `${percentage}%`,
                      }}
                      className={`${styles.scoreBar}`}
                    ></Box>
                  </Box>
                  <Text className={styles.scoreLabel}>{percentage}%</Text>
                </HStack>
              );
            })}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};

export const OverviewVaultContainer = withTransition(VaultContainer);
