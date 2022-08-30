import styles from "../styles/Main.module.css";
import { VStack, HStack, Box, Text, Button, Image } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

import { FaGithub } from "react-icons/fa";

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
            <VStack>
              <Text className={styles.balanceContainerTitle}>
                Your Total Balance
              </Text>
              <Text className={styles.balanceContainerBalance}>$12,891.90</Text>
            </VStack>
            <VStack>
              <HStack>
                <CopyIcon />
                <Text className={styles.balanceContainerAddress}>
                  0x2dA9...796e
                </Text>
              </HStack>
              <HStack className={styles.balanceContainerButtons}>
                <Button>Buy</Button>
                <Button>Send</Button>
                <Button>Swap</Button>
              </HStack>
            </VStack>
          </HStack>
          <HStack gap={2}>
            <VStack className={styles.tokenContainer}>
              <Text className={styles.tokenContainerTitle}>Tokens</Text>
              <VStack>
                {dummyData.map(({ name, balance, symbol, imageUrl }, idx) => (
                  <HStack key={idx}>
                    <Image
                      src={imageUrl}
                      alt={name}
                      className={styles.tokenImage}
                    />
                    <Text>{name}</Text>
                    <VStack>
                      <Text>{balance}</Text>
                      <Text>{`${balance}${symbol}`}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </VStack>
            <VStack className={styles.detailContainer}>
              <Text className={styles.detailContainerTitle}>Overview</Text>
            </VStack>
          </HStack>
        </VStack>
      </HStack>
    </div>
  );
};

export default Main;
