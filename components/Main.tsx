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
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { FaGithub } from "react-icons/fa";
import PieChart from "@components/PieChart";
import { useState } from "react";
import SuccessLottie from "@components/SuccessLottie";

const dummyData = [
  {
    id: 1,
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    id: 2,
    name: "Bitcoin",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    id: 3,
    name: "Ethereum",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    id: 4,
    name: "Dogecoin",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    id: 5,
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    id: 6,
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    id: 7,
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
  {
    id: 8,
    name: "Lukso",
    balance: "0.00",
    symbol: "LYX",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
  },
];

const Main = () => {
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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
                {dummyData.map((token, idx) => (
                  <HStack
                    key={idx}
                    className={`${styles.tokenListCell} ${
                      selectedToken && selectedToken.id === token.id
                        ? styles.selectedCell
                        : ""
                    }`}
                    onClick={() => setSelectedToken(token)}
                  >
                    <HStack className={styles.tokenListCellLeftSection}>
                      <Image
                        src={token.imageUrl}
                        alt={token.name}
                        className={styles.tokenImage}
                      />
                      <Text className={styles.tokenName}>{token.name}</Text>
                    </HStack>
                    <VStack className={styles.tokenListCellRightSection}>
                      <Text className={styles.tokenFiatBalance}>
                        {token.balance}
                      </Text>
                      <Text
                        className={styles.tokenCryptoBalance}
                      >{`${token.balance}${token.symbol}`}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </VStack>
            {true ? (
              <SuccessContainer />
            ) : !selectedToken ? (
              <OverviewContainer />
            ) : (
              <SendTokenContainer
                setIsSuccess={setIsSuccess}
                tokenName={selectedToken.name}
              />
            )}
          </HStack>
        </VStack>
      </HStack>
    </div>
  );
};

const SuccessContainer = () => {
  return (
    <VStack className={styles.detailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Overview</Text>
      </Box>
      <VStack className={styles.sentContainer}>
        <VStack className={styles.sentContainerLottie}>
          <SuccessLottie />
        </VStack>
        <VStack className={styles.sentContainerTextContainer}>
          <Text className={styles.sentContainerTitle}>Successfully Sent!</Text>
          <Text className={styles.sentContainerSubtitle}>1 LYX.t</Text>
          <Text className={styles.sentContainerFooter}>
            It may take up to ~2 min for the transaction to complete
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
};

const OverviewContainer = () => {
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
  );
};

type SendTokenContainerProps = {
  tokenName: string;
  setIsSuccess: (isSuccess: boolean) => void;
};

const SendTokenContainer = ({
  tokenName,
  setIsSuccess,
}: SendTokenContainerProps) => {
  return (
    <VStack className={styles.detailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text
          className={styles.detailContainerTitle}
        >{`Send ${tokenName}`}</Text>
      </Box>
      <VStack className={styles.sendTokenContentContainer} gap={7}>
        <HStack className={styles.sendTokenInputContainer}>
          <Button className={styles.sendTokenMaxButton}>
            <Text>MAX</Text>
          </Button>
          <Input placeholder="$0" className={styles.amountInput} />
          <Button className={styles.sendTokenMaxButton}>
            <ArrowUpDownIcon color="white" w="20px" h="20px" />
          </Button>
        </HStack>
        <VStack className={styles.recipientContainer}>
          <Text className={styles.recipientLabel}>Recipient</Text>
          <Input placeholder="Enter Address" className={styles.addressInput} />
        </VStack>
        <HStack className={styles.switchContainer}>
          <Switch
            defaultChecked
            colorScheme="purple"
            onChange={() => {}}
            className={styles.forceSwitch}
          />
          <Text className={styles.switchText}>
            I would like to send my tokens to this address, even if it does not
            support the LSP1-UniversalReceiver standard. Learn more
          </Text>
        </HStack>
        <HStack className={styles.buttonContainer}>
          <Button className={styles.cancelButton}>Cancel</Button>
          <Button
            className={styles.sendButton}
            onClick={() => setIsSuccess(true)}
          >
            Send
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Main;
