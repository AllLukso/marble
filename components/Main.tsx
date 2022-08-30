import styles from "../styles/Main.module.css";
import { VStack, HStack, Box, Text, Button, Image } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { FaGithub } from "react-icons/fa";
import PieChart from "@components/PieChart";

const dummyData = [
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
];

const Main = () => {
  return (
    <div className={styles.container}>
      <HStack className={styles.contentContainer} gap={2}>
        <VStack className={styles.sidebarContainer}>
          <VStack>
            <Box className={styles.profileContainer}>
              <Box className={styles.coverImageOverlay}></Box>
              <Image
                src="/cover.png"
                alt="cover image"
                className={styles.coverImage}
              ></Image>
              <VStack className={styles.profileContentContainer}>
                <Image
                  src="/profile.png"
                  alt="cover image"
                  className={styles.profileImage}
                ></Image>
                <HStack className={styles.profileNameContainer}>
                  <Text className={styles.profileUsername}>iamminci</Text>
                  <Text className={styles.profileUserhash}>#4229</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
          <VStack className={styles.sidebarTabListContainer}>
            <HStack className={styles.sidebarTabContainer}>
              <FaGithub color="white" />
              <Text className={styles.sidebarTabTitle}>Crypto</Text>
            </HStack>
            <HStack className={styles.sidebarTabContainer}>
              <FaGithub color="white" />
              <Text className={styles.sidebarTabTitle}>NFTs</Text>
            </HStack>
            <HStack className={styles.sidebarTabContainer}>
              <FaGithub color="white" />
              <Text className={styles.sidebarTabTitle}>Vaults</Text>
            </HStack>
            <HStack className={styles.sidebarTabContainer}>
              <FaGithub color="white" />
              <Text className={styles.sidebarTabTitle}>Staking</Text>
            </HStack>
            <HStack className={styles.sidebarTabContainer}>
              <FaGithub color="white" />
              <Text className={styles.sidebarTabTitle}>Governance</Text>
            </HStack>
            <HStack className={styles.sidebarTabContainer}>
              <FaGithub color="white" />
              <Text className={styles.sidebarTabTitle}>Settings</Text>
            </HStack>
          </VStack>
          <Text className={styles.sidebarFooter}>
            Made with ❤️ by @iamminci
          </Text>
        </VStack>
        <VStack className={styles.mainContainer} gap={2}>
          <HStack className={styles.balanceContainer}>
            <VStack className={styles.balanceContainerLeftSection}>
              <Text className={styles.balanceContainerTitle}>
                Your Total Balance
              </Text>
              <Text className={styles.balanceContainerBalance}>$12,891.90</Text>
            </VStack>
            <VStack className={styles.balanceContainerRightSection}>
              <HStack>
                <CopyIcon color="white" />
                <Text className={styles.balanceContainerAddress}>
                  0x2dA9...796e
                </Text>
              </HStack>
              <HStack className={styles.balanceContainerButtonList}>
                <Button className={styles.balanceContainerButton}>
                  <FaGithub color="white" />
                  <Text className={styles.balanceContainerButtonText}>Buy</Text>
                </Button>
                <Button className={styles.balanceContainerButton}>
                  <FaGithub color="white" />
                  <Text className={styles.balanceContainerButtonText}>
                    Send
                  </Text>
                </Button>
                <Button className={styles.balanceContainerButton}>
                  <FaGithub color="white" />
                  <Text className={styles.balanceContainerButtonText}>
                    Swap
                  </Text>
                </Button>
              </HStack>
            </VStack>
          </HStack>
          <HStack gap={2}>
            <VStack className={styles.tokenContainer}>
              <Box className={styles.tokenContainerTitleBox}>
                <Text className={styles.tokenContainerTitle}>Tokens</Text>
              </Box>
              <VStack className={styles.tokenListCellContainer}>
                {dummyData.map(({ name, balance, symbol, imageUrl }, idx) => (
                  <HStack key={idx} className={styles.tokenListCell}>
                    <HStack className={styles.tokenListCellLeftSection}>
                      <Image
                        src={imageUrl}
                        alt={name}
                        className={styles.tokenImage}
                      />
                      <Text className={styles.tokenName}>{name}</Text>
                    </HStack>
                    <VStack className={styles.tokenListCellRightSection}>
                      <Text className={styles.tokenFiatBalance}>{balance}</Text>
                      <Text
                        className={styles.tokenCryptoBalance}
                      >{`${balance}${symbol}`}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </VStack>
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
                {dummyData.map(({ name, balance }, idx) => (
                  <HStack key={idx} className={styles.scoreContainer}>
                    <Text className={styles.scoreLabel}>{name}</Text>
                    <Box className={`${styles.scoreBarContainer}`}>
                      <Box className={`${styles.scoreBar}`}></Box>
                    </Box>
                    <Text className={styles.scoreLabel}>8.6</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </HStack>
        </VStack>
      </HStack>
    </div>
  );
};

export default Main;
