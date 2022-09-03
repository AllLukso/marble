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
  Spinner,
  Link,
  Tooltip,
} from "@chakra-ui/react";
import { FaRegPaperPlane, FaBinoculars } from "react-icons/fa";
import { useState } from "react";

import SuccessContainer from "@components/Success";
import { OverviewNFTContainer } from "@components/Overview";
import useOwnedNFTs from "@hooks/useOwnedNFTs";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";
import useTransfer from "@hooks/useTransfer";
import { ToastContainer, toast } from "react-toastify";
import withTransition from "@components/withTransition";

type NFTContainerProps = {
  address?: string;
};

const NFTContainer = ({ address }: NFTContainerProps) => {
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [amount, setAmount] = useState("");
  const { NFTs, collections, isLoading } = useOwnedNFTs(address);
  const { web3 } = useLuksoWeb3();

  function testToast() {
    toast(<CustomToast txnHash={""} />, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const CustomToast = ({ txnHash }: any) => {
    return (
      <Link
        href={`https://explorer.execution.l16.lukso.network/tx/${txnHash}`}
        isExternal
      >
        <Text className={styles.toastText}>
          🎉 Transaction Success!
          <br />
          View details on BlockScout
        </Text>
      </Link>
    );
  };

  function handleSelectNFT(nft: any) {
    if (selectedNFT === nft) {
      setSelectedNFT(null);
    } else {
      setSelectedNFT(nft);
    }
  }

  function handleSuccess(txnHash: string) {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      toast(<CustomToast txnHash={txnHash} />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, 3000);
  }

  return (
    <HStack className={styles.cryptoContainer} gap={2}>
      <VStack className={styles.NFTContainer}>
        <Box className={styles.tokenContainerTitleBox}>
          <Text className={styles.tokenContainerTitle}>NFTs</Text>
        </Box>
        <VStack className={styles.tokenListCellContainer}>
          <SimpleGrid columns={3} spacing={0}>
            {isLoading ? (
              <VStack h="10rem" justifyContent="center" alignItems="center">
                <Spinner color="white" size="lg" />
              </VStack>
            ) : (
              NFTs.map((nft: any, idx: any) => (
                <VStack
                  key={idx}
                  className={`${styles.NFTListCell} ${
                    selectedNFT && selectedNFT.tokenId === nft.tokenId
                      ? styles.selectedCell
                      : ""
                  }`}
                  onClick={() => handleSelectNFT(nft)}
                  //   onClick={testToast}
                >
                  <Image
                    src={nft.iconUrl}
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
                    >{`ID: ${web3.utils.hexToString(nft.tokenId)}`}</Text>
                  </VStack>
                </VStack>
              ))
            )}
          </SimpleGrid>
          <ToastContainer />
        </VStack>
      </VStack>
      {isSuccess ? (
        <SuccessContainer
          type="nft"
          label={`${selectedNFT.name} ${web3.utils.hexToString(
            selectedNFT.tokenId
          )}`}
        />
      ) : !selectedNFT ? (
        <OverviewNFTContainer tokens={collections} />
      ) : !isSend ? (
        <NFTDetailContainer setIsSend={setIsSend} nft={selectedNFT} />
      ) : (
        <SendNFTContainerWithTransition
          address={address}
          amount={amount}
          setIsSend={setIsSend}
          handleSuccess={handleSuccess}
          setSelectedToken={setSelectedNFT}
          nft={selectedNFT}
        />
      )}
    </HStack>
  );
};

type SendNFTContainerProps = {
  nft: any;
  amount: string;
  setIsSend: (isSend: boolean) => void;
  setSelectedToken: (token: any) => void;
  handleSuccess: (txnHash: string) => void;
  address?: string;
};

const SendNFTContainer = ({
  address,
  nft,
  amount,
  setIsSend,
  setSelectedToken,
  handleSuccess,
}: SendNFTContainerProps) => {
  const [recipient, setRecipient] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isForce, setIsForce] = useState(false);
  const { web3 } = useLuksoWeb3();
  const { transfer, isLoading: isTransferLoading } = useTransfer();

  if (!nft) return null;

  async function handleTransfer() {
    if (!address) return;
    try {
      setErrorMessage("");
      const tx = await transfer(address, recipient, amount, nft, isForce);
      handleSuccess(tx.transactionHash);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  function handleRecipientChange(e: any) {
    setRecipient(e.target.value);
  }

  function handleForceSwitch(e: any) {
    setIsForce(e.target.checked);
  }

  function handleCancel() {
    setSelectedToken(null);
    setIsSend(false);
  }

  return (
    <VStack className={styles.NFTdetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>{`Send ${
          nft.name
        } #${web3.utils.hexToString(nft.tokenId)}`}</Text>
      </Box>
      <VStack className={styles.sendNFTContentContainer} gap={3}>
        <Image
          src={nft.iconUrl}
          alt={nft.name}
          className={styles.NFTdetailImage}
        ></Image>
        <VStack className={styles.NFTrecipientContainer}>
          <Text className={styles.NFTrecipientLabel}>Recipient</Text>
          <Input
            placeholder="Enter Address"
            className={styles.NFTaddressInput}
            onChange={handleRecipientChange}
            value={recipient}
          />
        </VStack>
        <HStack className={styles.NFTswitchContainer}>
          <Switch
            colorScheme="purple"
            onChange={handleForceSwitch}
            className={styles.forceSwitch}
          />
          <Text className={styles.NFTswitchText}>
            I would like to send my NFT to this address, even if it does not
            support the LSP1-UniversalReceiver standard. Learn more.
          </Text>
        </HStack>
        <HStack className={styles.buttonContainer}>
          <Button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </Button>
          <Button className={styles.sendButton} onClick={handleTransfer}>
            {isTransferLoading ? <Spinner color="white" /> : "Send"}
          </Button>
        </HStack>
      </VStack>
      {errorMessage && (
        <Text
          style={{ paddingTop: "1rem", color: "red" }}
        >{`Error: ${errorMessage}`}</Text>
      )}
    </VStack>
  );
};

const SendNFTContainerWithTransition = withTransition(SendNFTContainer);

type NFTDetailContainerProps = {
  nft: any;
  setIsSend: (isSend: boolean) => void;
};

const NFTDetailContainer = ({ nft, setIsSend }: NFTDetailContainerProps) => {
  const { web3 } = useLuksoWeb3();
  return (
    <VStack className={styles.NFTdetailContainer}>
      <HStack className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>{`${
          nft.name
        } #${web3.utils.hexToString(nft.tokenId)}`}</Text>
        <HStack className={styles.NFTdetailbuttonContainer}>
          <Tooltip label="Send NFT" aria-label="A tooltip">
            <Button
              className={styles.NFTdetailButton}
              onClick={() => setIsSend(true)}
            >
              <FaRegPaperPlane color="white" size="1.5rem" />
            </Button>
          </Tooltip>
          <Tooltip label="View on BlockScout" aria-label="A tooltip">
            <Link
              href={`https://explorer.execution.l16.lukso.network/address/${nft.tokenContract._address}`}
              isExternal
              margin="0 !important"
            >
              <Button className={styles.NFTdetailButton}>
                <FaBinoculars color="white" size="1.5rem" />
              </Button>
            </Link>
          </Tooltip>
        </HStack>
      </HStack>
      <VStack className={styles.NFTcontentContainer} gap={7}>
        <Image
          src={nft.iconUrl}
          alt={nft.name}
          className={styles.NFTdetailImage}
        ></Image>
        <VStack className={styles.NFTdetailTextContainer} gap={3}>
          <HStack className={styles.NFTdetailTextSubcontainer}>
            <Text className={styles.NFTdetailTitle}>Collection</Text>
            <Text className={styles.NFTdetailSubtitle}>{nft.name}</Text>
          </HStack>
          <HStack className={styles.NFTdetailTextSubcontainer}>
            <Text className={styles.NFTdetailTitle}>Token ID</Text>
            <Text className={styles.NFTdetailSubtitle}>
              {web3.utils.hexToString(nft.tokenId)}
            </Text>
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

export default withTransition(NFTContainer);
