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
  SimpleGrid,
} from "@chakra-ui/react";
import { CopyIcon, RepeatIcon } from "@chakra-ui/icons";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { FaGithub, FaRegPaperPlane, FaBinoculars } from "react-icons/fa";
import PieChart from "@components/PieChart";
import { useState } from "react";
import SuccessLottie from "@components/SuccessLottie";
import Link from "next/link";

import { useRouter } from "next/router";
import { dummyData } from "@data/crypto";
import { dummyData as NFTData } from "@data/nft";

import SuccessContainer from "@components/Success";
import {
  OverviewCryptoContainer,
  OverviewNFTContainer,
} from "@components/Overview";
import CryptoContainer from "@components/Crypto";

const Main = () => {
  const router = useRouter();

  function getContent() {
    switch (router.asPath) {
      case "/":
        return <CryptoContainer />;
      case "/#crypto":
        return <CryptoContainer />;
      case "/#nft":
        return <NFTContainer />;
      default:
        return <CryptoContainer />;
    }
  }

  return (
    <div className={styles.container}>
      <HStack className={styles.contentContainer} gap={2}>
        <SidebarContainer />
        <VStack className={styles.mainContainer} gap={2}>
          <BalanceContainer />
          {getContent()}
        </VStack>
      </HStack>
    </div>
  );
};

const BalanceContainer = () => {
  return (
    <HStack className={styles.balanceContainer}>
      <VStack className={styles.balanceContainerLeftSection}>
        <Text className={styles.balanceContainerTitle}>Your Total Balance</Text>
        <Text className={styles.balanceContainerBalance}>$12,891.90</Text>
      </VStack>
      <VStack className={styles.balanceContainerRightSection}>
        <HStack>
          <CopyIcon color="white" />
          <Text className={styles.balanceContainerAddress}>0x2dA9...796e</Text>
        </HStack>
        <HStack className={styles.balanceContainerButtonList}>
          <Button className={styles.balanceContainerButton}>
            <FaGithub color="white" />
            <Text className={styles.balanceContainerButtonText}>Buy</Text>
          </Button>
          <Button className={styles.balanceContainerButton}>
            <FaGithub color="white" />
            <Text className={styles.balanceContainerButtonText}>Send</Text>
          </Button>
          <Button className={styles.balanceContainerButton}>
            <FaGithub color="white" />
            <Text className={styles.balanceContainerButtonText}>Swap</Text>
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
};

const SidebarContainer = () => {
  return (
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
        <Link href="/#crypto">
          <HStack className={styles.sidebarTabContainer}>
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Crypto</Text>
          </HStack>
        </Link>
        <Link href="/#nft">
          <HStack className={styles.sidebarTabContainer}>
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>NFTs</Text>
          </HStack>
        </Link>
        <Link href="/#vault">
          <HStack className={styles.sidebarTabContainer}>
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Vaults</Text>
          </HStack>
        </Link>
        <Link href="/#staking">
          <HStack className={styles.sidebarTabContainer}>
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Staking</Text>
          </HStack>
        </Link>
        <Link href="/#governance">
          <HStack className={styles.sidebarTabContainer}>
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Governance</Text>
          </HStack>
        </Link>
        <Link href="/#settings">
          <HStack className={styles.sidebarTabContainer}>
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Settings</Text>
          </HStack>
        </Link>
      </VStack>
      <Text className={styles.sidebarFooter}>Made with ❤️ by @iamminci</Text>
    </VStack>
  );
};

const NFTContainer = () => {
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <HStack className={styles.cryptoContainer} gap={2}>
      <VStack className={styles.NFTContainer}>
        <Box className={styles.tokenContainerTitleBox}>
          <Text className={styles.tokenContainerTitle}>NFTs</Text>
        </Box>
        <VStack className={styles.tokenListCellContainer}>
          <SimpleGrid columns={3} spacing={0}>
            {NFTData.map((nft, idx) => (
              <VStack
                key={idx}
                className={`${styles.NFTListCell} ${
                  selectedNFT && selectedNFT.id === nft.id
                    ? styles.selectedCell
                    : ""
                }`}
                onClick={() => setSelectedNFT(nft)}
              >
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  className={styles.NFTImage}
                />
                <VStack className={styles.NFTListCellNameContainer}>
                  <Text className={styles.NFTName}>{nft.name}</Text>
                  <Text className={styles.NFTCollectionName}>
                    {nft.collection}
                  </Text>
                </VStack>
                <VStack className={styles.NFTListCellFooter}>
                  <Text
                    className={styles.NFTTokenID}
                  >{`ID: ${nft.tokenId}`}</Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      </VStack>
      {isSuccess ? (
        <SuccessContainer />
      ) : !selectedNFT ? (
        <OverviewNFTContainer data={dummyData} />
      ) : (
        <NFTDetailContainer
          // setIsSuccess={setIsSuccess}
          nft={selectedNFT}
        />
      )}
    </HStack>
  );
};

type NFTDetailContainerProps = {
  nft: any;
  setIsSuccess?: (isSuccess: boolean) => void;
};

const NFTDetailContainer = ({ nft, setIsSuccess }: NFTDetailContainerProps) => {
  return (
    <VStack className={styles.NFTdetailContainer}>
      <HStack className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>{nft.name}</Text>
        <HStack className={styles.NFTdetailbuttonContainer}>
          <Button className={styles.NFTdetailButton}>
            <RepeatIcon color="white" w="1.5rem" h="1.5rem" />
          </Button>
          <Button className={styles.NFTdetailButton}>
            <FaRegPaperPlane color="white" size="1.5rem" />
          </Button>
          <Button className={styles.NFTdetailButton}>
            <FaBinoculars color="white" size="1.5rem" />
          </Button>
        </HStack>
      </HStack>
      <VStack className={styles.NFTcontentContainer} gap={7}>
        <Image
          src={nft.imageUrl}
          alt={nft.name}
          className={styles.NFTdetailImage}
        ></Image>
        <VStack className={styles.NFTdetailTextContainer} gap={3}>
          <HStack className={styles.NFTdetailTextSubcontainer}>
            <Text className={styles.NFTdetailTitle}>Collection</Text>
            <Text className={styles.NFTdetailSubtitle}>{nft.collection}</Text>
          </HStack>
          <HStack className={styles.NFTdetailTextSubcontainer}>
            <Text className={styles.NFTdetailTitle}>Token ID</Text>
            <Text className={styles.NFTdetailSubtitle}>{nft.tokenId}</Text>
          </HStack>
          <VStack className={styles.NFTdetailDescriptionContainer}>
            <Text className={styles.NFTdetailTitle}>Description</Text>
            <Text className={styles.NFTdetailSubtitle}>{nft.description}</Text>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

type SendTokenContainerProps = {
  nftName: string;
  setIsSuccess: (isSuccess: boolean) => void;
};

const SendNFTContainer = ({
  nftName,
  setIsSuccess,
}: SendTokenContainerProps) => {
  return (
    <VStack className={styles.NFTdetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>{`Send ${nftName}`}</Text>
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
