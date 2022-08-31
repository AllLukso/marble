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
import { RepeatIcon } from "@chakra-ui/icons";
import { FaRegPaperPlane, FaBinoculars } from "react-icons/fa";
import { useState } from "react";

import { dummyData } from "@data/crypto";
import { dummyData as NFTData } from "@data/nft";

import SuccessContainer from "@components/Success";
import { OverviewNFTContainer } from "@components/Overview";

const NFTContainer = () => {
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSend, setIsSend] = useState(false);

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
        <SuccessContainer type="NFT" label={selectedNFT.name} />
      ) : !selectedNFT ? (
        <OverviewNFTContainer data={dummyData} />
      ) : !isSend ? (
        <NFTDetailContainer setIsSend={setIsSend} nft={selectedNFT} />
      ) : (
        <SendNFTContainer setIsSuccess={setIsSuccess} nft={selectedNFT} />
      )}
    </HStack>
  );
};

type NFTDetailContainerProps = {
  setIsSend: (isSend: boolean) => void;
  nft: any;
};

const NFTDetailContainer = ({ nft, setIsSend }: NFTDetailContainerProps) => {
  return (
    <VStack className={styles.NFTdetailContainer}>
      <HStack className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>{nft.name}</Text>
        <HStack className={styles.NFTdetailbuttonContainer}>
          <Button className={styles.NFTdetailButton}>
            <RepeatIcon color="white" w="1.5rem" h="1.5rem" />
          </Button>
          <Button
            className={styles.NFTdetailButton}
            onClick={() => setIsSend(true)}
          >
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
  nft: any;
  setIsSuccess: (isSuccess: boolean) => void;
};

const SendNFTContainer = ({ nft, setIsSuccess }: SendTokenContainerProps) => {
  return (
    <VStack className={styles.NFTdetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text
          className={styles.detailContainerTitle}
        >{`Send ${nft.name}`}</Text>
      </Box>
      <VStack className={styles.sendNFTContentContainer} gap={3}>
        <Image
          src={nft.imageUrl}
          alt={nft.name}
          className={styles.NFTdetailImage}
        ></Image>
        <VStack className={styles.NFTrecipientContainer}>
          <Text className={styles.NFTrecipientLabel}>Recipient</Text>
          <Input
            placeholder="Enter Address"
            className={styles.NFTaddressInput}
          />
        </VStack>
        <HStack className={styles.NFTswitchContainer}>
          <Switch
            defaultChecked
            colorScheme="purple"
            onChange={() => {}}
            className={styles.forceSwitch}
          />
          <Text className={styles.NFTswitchText}>
            I would like to send my NFT to this address, even if it does not
            support the LSP1-UniversalReceiver standard. Learn more.
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

export default NFTContainer;
