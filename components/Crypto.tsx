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
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import SuccessContainer from "@components/Success";
import { OverviewCryptoContainer } from "@components/Overview";
import useOwnedTokens from "hooks/useOwnedTokens";
import withTransition from "@components/withTransition";
import { useLuksoWeb3 } from "./LuksoWeb3Provider";
import useTransfer from "@hooks/useTransfer";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "@components/CustomToast";

type CryptoContainerProps = {
  address?: string;
};

const CryptoContainer = ({ address }: CryptoContainerProps) => {
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { tokens, isLoading } = useOwnedTokens(address);
  const [amount, setAmount] = useState("");

  // sort tokens by descending balance, TODO: sort them by fiat balance
  const sortedTokens = tokens
    .sort((a: any, b: any) => {
      if (a.balance === b.balance) {
        if (a.symbol < b.symbol) return -1;
        if (a.symbol > b.symbol) return 1;
        return 0;
      }
      if (a.balance < b.balance) return -1;
      if (a.balance > b.balance) return 1;
      return 0;
    })
    .reverse();

  function handleSelectToken(token: any) {
    if (selectedToken === token) {
      setSelectedToken(null);
    } else {
      setSelectedToken(token);
    }
  }

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
      <VStack className={styles.tokenContainer}>
        <Box className={styles.tokenContainerTitleBox}>
          <Text className={styles.tokenContainerTitle}>Tokens</Text>
        </Box>
        <VStack className={styles.tokenListCellContainer}>
          {isLoading ? (
            <VStack h="10rem" justifyContent="center" alignItems="center">
              <Spinner color="white" size="lg" />
            </VStack>
          ) : (
            sortedTokens.map((token: any, idx: any) => {
              return (
                <HStack
                  key={idx}
                  className={`${styles.tokenListCell} ${
                    selectedToken && selectedToken.symbol === token.symbol
                      ? styles.selectedCell
                      : ""
                  }`}
                  onClick={() => handleSelectToken(token)}
                  //   onClick={testToast}
                >
                  <HStack className={styles.tokenListCellLeftSection}>
                    <Image
                      src={token.iconUrl}
                      alt={token.name}
                      className={styles.tokenImage}
                    />
                    <Text className={styles.tokenName}>{token.name}</Text>
                  </HStack>
                  <VStack className={styles.tokenListCellRightSection}>
                    {/* <Text className={styles.tokenFiatBalance}>{token.balance}</Text> */}
                    <Text
                      className={styles.tokenCryptoBalance}
                    >{`${token.balance} ${token.symbol}`}</Text>
                  </VStack>
                </HStack>
              );
            })
          )}
        </VStack>
        <ToastContainer />
      </VStack>
      {isSuccess ? (
        <SuccessContainer
          type="crypto"
          label={`${amount} ${selectedToken.name}`}
        />
      ) : !selectedToken ? (
        <OverviewCryptoContainer tokens={tokens} />
      ) : (
        <SendTokenContainerWithTransition
          address={address}
          amount={amount}
          setAmount={setAmount}
          handleSuccess={handleSuccess}
          setSelectedToken={setSelectedToken}
          token={selectedToken}
        />
      )}
    </HStack>
  );
};

type SendTokenContainerProps = {
  token: any;
  amount: string;
  setAmount: (amount: string) => void;
  setSelectedToken: (token: any) => void;
  handleSuccess: (txnHash: string) => void;
  address?: string;
};

const SendTokenContainer = ({
  address,
  token,
  amount,
  setAmount,
  setSelectedToken,
  handleSuccess,
}: SendTokenContainerProps) => {
  const [recipient, setRecipient] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isForce, setIsForce] = useState(false);
  const { balance } = useLuksoWeb3();
  const { transfer, isLoading: isTransferLoading } = useTransfer();

  if (!token) return null;

  async function handleTransfer() {
    if (!address) return;
    try {
      setErrorMessage("");
      const tx = await transfer(address, recipient, amount, token, isForce);
      handleSuccess(tx.transactionHash);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  function handleAmountChange(e: any) {
    setAmount(e.target.value);
  }

  function handleRecipientChange(e: any) {
    setRecipient(e.target.value);
  }

  function handleForceSwitch(e: any) {
    setIsForce(e.target.checked);
  }

  function handleMaxAmount() {
    if (token.tokenType === "LSP7") {
      setAmount(token.balance ?? "0");
    } else {
      setAmount(balance ?? "0");
    }
  }

  return (
    <VStack className={styles.detailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text
          className={styles.detailContainerTitle}
        >{`Send ${token.name}`}</Text>
      </Box>
      <VStack className={styles.sendTokenContentContainer} gap={7}>
        <VStack>
          <HStack className={styles.sendTokenInputContainer}>
            <Button
              className={styles.sendTokenMaxButton}
              onClick={handleMaxAmount}
            >
              <Text>MAX</Text>
            </Button>
            <Input
              type="number"
              placeholder="0"
              className={styles.amountInput}
              value={amount}
              onChange={handleAmountChange}
            />
            <Tooltip label="Fiat input coming soon." aria-label="A tooltip">
              <Button className={styles.sendTokenMaxButton}>
                <ArrowUpDownIcon color="white" w="20px" h="20px" />
              </Button>
            </Tooltip>
          </HStack>
          <Text className={styles.symbolLabel}>{`in ${token.symbol}`}</Text>
        </VStack>
        <VStack className={styles.recipientContainer}>
          <Text className={styles.recipientLabel}>Recipient</Text>
          <Input
            placeholder="Enter Address"
            className={styles.addressInput}
            onChange={handleRecipientChange}
            value={recipient}
          />
        </VStack>
        {token.name === "LUKSO" ? (
          <Box w="100%" h="2.5rem"></Box>
        ) : (
          <HStack className={styles.switchContainer}>
            <Switch
              colorScheme="purple"
              onChange={handleForceSwitch}
              className={styles.forceSwitch}
            />
            <Text className={styles.switchText}>
              I would like to send my tokens to this address, even if it does
              not support the LSP1-UniversalReceiver standard. Learn more
            </Text>
          </HStack>
        )}
        <HStack className={styles.buttonContainer}>
          <Button
            className={styles.cancelButton}
            onClick={() => setSelectedToken(null)}
          >
            Cancel
          </Button>
          <Button className={styles.sendButton} onClick={handleTransfer}>
            {isTransferLoading ? <Spinner color="white" /> : "Send"}
          </Button>
        </HStack>
        {errorMessage && (
          <Text
            style={{ paddingTop: "1rem", color: "red" }}
          >{`Error: ${errorMessage}`}</Text>
        )}
      </VStack>
    </VStack>
  );
};

const SendTokenContainerWithTransition = withTransition(SendTokenContainer);

export default withTransition(CryptoContainer);
