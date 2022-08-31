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
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { dummyData } from "@data/crypto";
import SuccessContainer from "@components/Success";
import { OverviewCryptoContainer } from "@components/Overview";

const CryptoContainer = () => {
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <HStack className={styles.cryptoContainer} gap={2}>
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
                <Text className={styles.tokenFiatBalance}>{token.balance}</Text>
                <Text
                  className={styles.tokenCryptoBalance}
                >{`${token.balance}${token.symbol}`}</Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </VStack>
      {isSuccess ? (
        <SuccessContainer />
      ) : !selectedToken ? (
        <OverviewCryptoContainer data={dummyData} />
      ) : (
        <SendTokenContainer
          setIsSuccess={setIsSuccess}
          tokenName={selectedToken.name}
        />
      )}
    </HStack>
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

export default CryptoContainer;
