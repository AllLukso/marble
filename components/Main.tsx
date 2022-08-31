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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  BellIcon,
  CopyIcon,
  DownloadIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { FaGithub, FaRegPaperPlane, FaBinoculars } from "react-icons/fa";
import PieChart from "@components/PieChart";
import { useState } from "react";
import SuccessLottie from "@components/SuccessLottie";
import Link from "next/link";

import { useRouter } from "next/router";
import { dummyData } from "@data/crypto";
import { dummyData as NFTData } from "@data/nft";
import { dummyData as VaultData } from "@data/vault";

import SuccessContainer from "@components/Success";
import {
  OverviewCryptoContainer,
  OverviewNFTContainer,
  OverviewVaultContainer,
} from "@components/Overview";
import SidebarContainer from "@components/Sidebar";
import CryptoContainer from "@components/Crypto";
import NFTContainer from "@components/NFT";
import BalanceContainer from "@components/Balance";
import { abridgeAddress, abridgeMessage } from "@utils/index";

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
      case "/#vault":
        return <VaultContainer />;
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

const VaultContainer = () => {
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSend, setIsSend] = useState(false);

  return (
    <HStack className={styles.cryptoContainer} gap={2}>
      <VStack className={styles.VaultContainer}>
        <Box className={styles.VaultContainerTitleBox}>
          <Text className={styles.tokenContainerTitle}>Vaults</Text>
          <HStack className={styles.VaultButtonContainer}>
            <Button className={styles.VaultButton}>
              <AddIcon color="white" w="1.5rem" h="1.5rem" />
            </Button>
            <Button className={styles.VaultButton}>
              <BellIcon color="white" w="1.5rem" h="1.5rem" />
            </Button>
          </HStack>
        </Box>
        <VStack className={styles.tokenListCellContainer}>
          <SimpleGrid columns={2} spacing={0}>
            {VaultData.map((vault, idx) => (
              <VStack
                key={idx}
                className={`${styles.VaultListCell} ${
                  selectedVault && selectedVault.id === vault.id
                    ? styles.selectedCell
                    : ""
                }`}
                onClick={() => setSelectedVault(vault)}
              >
                <Image
                  src={vault.imageUrl}
                  alt={vault.name}
                  className={styles.VaultImage}
                />
                <VStack className={styles.NFTListCellNameContainer}>
                  <Text className={styles.NFTName}>{vault.name}</Text>
                  <Text className={styles.NFTCollectionName}>
                    {abridgeMessage(vault.description, 15)}
                  </Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      </VStack>
      {isSuccess ? (
        <SuccessContainer isNFT label={selectedVault.name} />
      ) : !selectedVault ? (
        <OverviewVaultContainer data={VaultData} />
      ) : !isSend ? (
        <VaultDetailContainer setIsSend={setIsSend} vault={selectedVault} />
      ) : (
        <SendNFTContainer setIsSuccess={setIsSuccess} vault={selectedVault} />
      )}
    </HStack>
  );
};

type VaultDetailContainerProps = {
  setIsSend: (isSend: boolean) => void;
  vault: any;
};

const VaultDetailContainer = ({
  vault,
  setIsSend,
}: VaultDetailContainerProps) => {
  return (
    <VStack className={styles.VaultDetailContainer}>
      <HStack className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>{vault.name}</Text>
        <HStack className={styles.VaultDetailbuttonContainer}>
          <Button className={styles.NFTdetailButton}>
            <ArrowDownIcon color="white" w="1.5rem" h="1.5rem" />
          </Button>
          <Button className={styles.NFTdetailButton}>
            <ArrowUpIcon color="white" w="1.5rem" h="1.5rem" />
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
        <HStack>
          <VStack className={styles.vaultDetailContentContainer}>
            <Text className={styles.vaultBalanceLabel}>Vault Balance</Text>
            <Text className={styles.vaultBalanceAmount}>$100.00</Text>
            <Text className={styles.vaultDetailSubtitle}>
              {vault.description}
            </Text>
          </VStack>
          <Image
            src={vault.imageUrl}
            alt={vault.name}
            className={styles.NFTdetailImage}
          ></Image>
        </HStack>
        <VStack className={styles.VaultDetailTextContainer} gap={3}>
          <Accordion allowMultiple className={styles.accordion}>
            <AccordionItem className={styles.accordionItem}>
              <h2>
                <AccordionButton className={styles.accordionButton}>
                  <HStack flex="1">
                    <Text className={styles.NFTdetailTitle}>Tokens</Text>
                    <Text className={styles.NFTdetailSubtitle}>
                      {vault.crypto.length}
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {vault.crypto.map((token, idx) => (
                  <HStack key={idx} className={styles.vaultTokenListCell}>
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
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem className={styles.accordionItem}>
              <h2>
                <AccordionButton className={styles.accordionButton}>
                  <HStack flex="1">
                    <Text className={styles.NFTdetailTitle}>NFTs</Text>
                    <Text className={styles.NFTdetailSubtitle}>
                      {vault.nft.length}
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid columns={3} spacing={0}>
                  {NFTData.map((nft, idx) => (
                    <VStack key={idx} className={styles.VaultNFTListCell}>
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
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem className={styles.accordionItem}>
              <h2>
                <AccordionButton className={styles.accordionButton}>
                  <HStack flex="1">
                    <Text className={styles.NFTdetailTitle}>Permissions</Text>
                    <Text className={styles.NFTdetailSubtitle}>
                      {vault.permissions.length}
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {vault.permissions.map((permission, idx) => (
                  <HStack
                    key={idx}
                    className={styles.vaultPermissionsContainer}
                  >
                    <Text className={styles.vaultPermissionTitle}>
                      {abridgeAddress(permission.address)}
                    </Text>
                    <Text className={styles.vaultPermissionSubtitle}>
                      {permission.access}
                    </Text>
                  </HStack>
                ))}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
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

export default Main;
