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
  Select,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Spinner,
  Link,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  StarIcon,
} from "@chakra-ui/icons";
import { doc, getDoc } from "firebase/firestore";
import db from "@firebase/firebase";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { FaRegPaperPlane, FaBinoculars } from "react-icons/fa";
import { useEffect, useState } from "react";

import SuccessContainer from "@components/Success";
import { OverviewVaultContainer } from "@components/Overview";
import { abridgeAddress } from "@utils/helpers";
import withTransition from "@components/withTransition";
import { useLuksoWeb3 } from "./LuksoWeb3Provider";
import useOwnedVaults from "@hooks/useOwnedVaults";
import useCreateVault from "@hooks/useVault";
import strToColor from "string-to-color";
import useOwnedTokens from "@hooks/useOwnedTokens";
import useOwnedNFTs from "@hooks/useOwnedNFTs";
import { Tooltip } from "@chakra-ui/react";
import useTransfer from "@hooks/useTransfer";
import CustomToast from "@components/CustomToast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useVault from "@hooks/useVault";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";

type VaultContainerProps = {
  address?: string;
};

export enum PageStateType {
  Overview,
  Create,
  Detail,
  Deposit,
  Withdraw,
  Transfer,
  Claim,
  Success,
}

const VaultContainer = ({ address }: VaultContainerProps) => {
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { vaults, isLoading } = useOwnedVaults(address);
  const [amount, setAmount] = useState("");
  const { claimVault } = useVault();
  const [unclaimedVaults, setUnclaimedVaults] = useState<any>([]);
  const { web3 } = useLuksoWeb3();
  const [showUnclaimed, setShowUnclaimed] = useState(false);

  const [pageState, setPageState] = useState<PageStateType>(
    PageStateType.Overview
  );
  const [prevPageState, setPrevPageState] = useState<PageStateType>(
    PageStateType.Overview
  );

  function switchPageState(state: PageStateType) {
    setPrevPageState(pageState);
    setPageState(state);
  }

  function handleSelectVault(vault: any) {
    if (selectedVault === vault) {
      setSelectedVault(null);
      switchPageState(PageStateType.Overview);
    } else {
      setSelectedVault(vault);
      switchPageState(PageStateType.Detail);
    }
  }

  function handleSuccess(txnHash: string) {
    switchPageState(PageStateType.Success);
    setTimeout(() => {
      switchPageState(PageStateType.Overview);
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

  // off-chain data to serve claim notifications
  useEffect(() => {
    async function fetchUnclaimedVaults() {
      if (!address) return;
      const docRef = doc(db, "addresses", address);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const { unclaimedVaults: fetchedAddresses } = data;
        const fetchedVaults = [];
        for (let i = 0; i < fetchedAddresses.length; i++) {
          const vaultAddress = fetchedAddresses[i];
          const fetchedBalance = await web3.eth.getBalance(vaultAddress);
          const formattedBalance = web3.utils.fromWei(fetchedBalance, "ether");
          fetchedVaults.push({
            name: abridgeAddress(vaultAddress),
            address: vaultAddress,
            balance: formattedBalance,
          });
        }
        setUnclaimedVaults(fetchedVaults);
      } else {
        console.log("No such document!");
      }
    }
    fetchUnclaimedVaults();
  }, [address]);

  function getVaultPageContent() {
    switch (pageState) {
      case PageStateType.Overview:
        return <OverviewVaultContainer vaults={vaults} />;
      case PageStateType.Create:
        return (
          <CreateVaultContainerWithTransition
            switchPageState={switchPageState}
            handleSuccess={handleSuccess}
          />
        );
      case PageStateType.Detail:
        return (
          <VaultDetailContainerWithTransition
            switchPageState={switchPageState}
            vault={selectedVault}
            handleSuccess={handleSuccess}
            isToClaim={unclaimedVaults.includes(selectedVault)}
          />
        );
      case PageStateType.Deposit:
        return (
          <DepositVaultContainerWithTransition
            vault={selectedVault}
            handleSuccess={handleSuccess}
            switchPageState={switchPageState}
            amount={amount}
            setAmount={setAmount}
          />
        );
      case PageStateType.Withdraw:
        return (
          <WithdrawVaultContainerWithTransition
            vault={selectedVault}
            handleSuccess={handleSuccess}
            switchPageState={switchPageState}
            amount={amount}
            setAmount={setAmount}
          />
        );
      case PageStateType.Transfer:
        return (
          <TransferVaultContainerWithTransition
            vault={selectedVault}
            handleSuccess={handleSuccess}
            switchPageState={switchPageState}
          />
        );
      case PageStateType.Success:
        return (
          <SuccessContainer type="vault" label="" pageState={prevPageState} />
        );
      default:
        return <OverviewVaultContainer vaults={vaults} />;
    }
  }

  const finalVaults = showUnclaimed ? unclaimedVaults : vaults;

  return (
    <HStack className={styles.cryptoContainer} gap={2}>
      <VStack className={styles.VaultContainer}>
        <Box className={styles.VaultContainerTitleBox}>
          <Text className={styles.vaultContainerTitle}>
            {showUnclaimed ? "Unclaimed Vaults" : "Vaults"}
          </Text>
          <HStack className={styles.VaultButtonContainer}>
            <Button
              className={styles.VaultButton}
              onClick={() => switchPageState(PageStateType.Create)}
            >
              <AddIcon color="white" w="1.5rem" h="1.5rem" />
            </Button>

            {unclaimedVaults.length ? (
              <Tooltip
                label="You have an unclaimed vault"
                aria-label="A tooltip"
              >
                <Button
                  className={styles.VaultButton}
                  onClick={() => setShowUnclaimed(!showUnclaimed)}
                >
                  <BellIcon color="white" w="1.5rem" h="1.5rem" />
                  <Box className={styles.bellNotification}>
                    <Text>{unclaimedVaults.length}</Text>
                  </Box>
                </Button>
              </Tooltip>
            ) : (
              <Button
                className={styles.VaultButton}
                onClick={() => setShowUnclaimed(!showUnclaimed)}
              >
                <BellIcon color="white" w="1.5rem" h="1.5rem" />
              </Button>
            )}
          </HStack>
        </Box>
        <VStack className={styles.tokenListCellContainer}>
          {isLoading ? (
            <VStack h="10rem" justifyContent="center" alignItems="center">
              <Spinner color="white" size="lg" />
            </VStack>
          ) : finalVaults.length === 0 ? (
            <VStack className={styles.tokenListCellContainer}>
              <VStack
                height="10rem"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="white" fontFamily="Montserrat">
                  {vaults.length > 0
                    ? "You do not have any unclaimed vaults."
                    : "You do not own any vaults yet."}
                </Text>
                {vaults.length === 0 && (
                  <Text
                    color="white"
                    fontFamily="Montserrat"
                    textDecoration="underline"
                    onClick={() => switchPageState(PageStateType.Create)}
                    cursor="pointer"
                  >
                    Create your first vault.
                  </Text>
                )}
              </VStack>
            </VStack>
          ) : (
            <SimpleGrid columns={2} spacing={0}>
              {finalVaults.map((vault: any, idx: any) => (
                <VStack
                  key={idx}
                  className={`${styles.VaultListCell} ${
                    selectedVault && selectedVault.address === vault.address
                      ? styles.selectedCell
                      : ""
                  }`}
                  onClick={() => handleSelectVault(vault)}
                >
                  <StarIcon
                    color={strToColor(vault.name)}
                    className={styles.vaultColorLabel}
                  ></StarIcon>
                  <Image
                    src="vault2.png"
                    alt={vault.address}
                    className={styles.VaultImage}
                  />
                  <VStack className={styles.NFTListCellNameContainer}>
                    <Text className={styles.NFTName}>{vault.name}</Text>
                    <Text className={styles.NFTCollectionName}>
                      {`Balance: ${vault.balance}`}
                    </Text>
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          )}
          <ToastContainer />
        </VStack>
      </VStack>
      {getVaultPageContent()}
    </HStack>
  );
};

type CreateVaultContainerProps = {
  switchPageState: (pageState: PageStateType) => void;
  handleSuccess: (txnHash: string) => void;
};

const CreateVaultContainer = ({
  switchPageState,
  handleSuccess,
}: CreateVaultContainerProps) => {
  const { createVault, isLoading, progress } = useCreateVault();
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleCreateVault() {
    try {
      setErrorMessage("");
      const tx = await createVault();
      handleSuccess(tx.transactionHash);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  return (
    <VStack className={styles.CreateVaultContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text className={styles.detailContainerTitle}>Create a New Vault</Text>
      </Box>
      <VStack className={styles.createVaultContainer} gap={3}>
        {/* TODO WHEN VAULT METADATA STANDARD IS OUT */}
        {/* <VStack className={styles.NFTrecipientContainer}>
          <Text className={styles.NFTrecipientLabel}>Vault Name</Text>
          <Input
            placeholder="Enter vault name"
            className={styles.NFTaddressInput}
          />
        </VStack>
        <VStack className={styles.NFTrecipientContainer}>
          <Text className={styles.NFTrecipientLabel}>Vault Description</Text>
          <Input
            placeholder="Enter vault description"
            className={styles.NFTaddressInput}
          />
        </VStack>
        <VStack className={styles.NFTrecipientContainer}>
          <Text className={styles.NFTrecipientLabel}>Vault Image</Text>
          <HStack className={styles.vaultImageUploadContainer}>
            <Text className={styles.vaultImageUpload}>
              Upload image with square dimensions.
            </Text>
            <input
              type="file"
              id="logoInput"
              accept="image/png, image/jpg"
              onChange={() => {}}
              className={styles.uploadButton}
            />
          </HStack>
        </VStack>
        <HStack className={styles.vaultSwitchContainer}>
          <Switch
            defaultChecked
            colorScheme="purple"
            onChange={() => {}}
            className={styles.forceSwitch}
          /> 
        </HStack> */}
        {!isLoading ? (
          <Text className={styles.vaultSwitchText} textAlign="center">
            Please note: You will be completing a series of 4-5 consecutive
            transactions in order to create your vault.
          </Text>
        ) : (
          <VStack w="100%" gap={3}>
            <Text className={styles.vaultSwitchText} textAlign="center">
              Please do not leave the page until all transactions have been
              successfully completed.
            </Text>
            <div className="progressBar" style={{ width: "20rem" }}>
              <ProgressBar animated now={progress} />
            </div>
          </VStack>
        )}
      </VStack>
      <HStack className={styles.createVaultbuttonContainer}>
        <Button
          className={styles.cancelButton}
          onClick={() => switchPageState(PageStateType.Overview)}
        >
          Cancel
        </Button>
        <Button className={styles.sendButton} onClick={handleCreateVault}>
          {isLoading ? <Spinner color="white" /> : "Create"}
        </Button>
      </HStack>
      {errorMessage && (
        <Text
          style={{ paddingTop: "1rem", color: "red" }}
        >{`Error: ${errorMessage}`}</Text>
      )}
    </VStack>
  );
};

const CreateVaultContainerWithTransition = withTransition(CreateVaultContainer);

type VaultDetailContainerProps = {
  switchPageState: (pageState: PageStateType) => void;
  vault: any;
  isToClaim: boolean;
  handleSuccess: (txnHash: string) => void;
};

const VaultDetailContainer = ({
  vault,
  switchPageState,
  isToClaim,
  handleSuccess,
}: VaultDetailContainerProps) => {
  const [copied, setCopied] = useState(false);
  const { tokens, isLoading: isTokensLoading } = useOwnedTokens(vault.address);
  const { NFTs, isLoading: isNFTsLoading } = useOwnedNFTs(vault.address);
  const { claimVault, isLoading: isClaimLoading } = useVault();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const { web3 } = useLuksoWeb3();

  async function handleCopy() {
    if (!vault.address) return;
    navigator.clipboard.writeText(vault.address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

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

  function handleAgreeSwitch(e: any) {
    setAgreed(e.target.checked);
  }

  async function handleClaim() {
    if (!vault) return;
    try {
      setErrorMessage("");
      const tx = await claimVault(vault.address);
      handleSuccess(tx.transactionHash);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  return (
    <VStack className={styles.VaultDetailContainer}>
      <HStack className={styles.detailContainerTitleBox}>
        <Text
          className={styles.detailAddressContainerTitle}
          cursor="pointer"
          onClick={handleCopy}
        >
          {vault.name}
        </Text>
        {copied && (
          <VStack className={styles.copiedVaultPopover}>
            <Text>Copied!</Text>
          </VStack>
        )}
        <StarIcon
          color={strToColor(vault.name)}
          className={styles.vaultDetailColorLabel}
        ></StarIcon>
        {!isToClaim ? (
          <HStack className={styles.VaultDetailbuttonContainer}>
            <Tooltip label="Withdraw" aria-label="A tooltip">
              <Button
                className={styles.NFTdetailButton}
                onClick={() => switchPageState(PageStateType.Withdraw)}
              >
                <ArrowDownIcon color="white" w="1.5rem" h="1.5rem" />
              </Button>
            </Tooltip>
            <Tooltip label="Deposit" aria-label="A tooltip">
              <Button
                className={styles.NFTdetailButton}
                onClick={() => switchPageState(PageStateType.Deposit)}
              >
                <ArrowUpIcon color="white" w="1.5rem" h="1.5rem" />
              </Button>
            </Tooltip>
            <Tooltip label="Transfer" aria-label="A tooltip">
              <Button
                className={styles.NFTdetailButton}
                onClick={() => switchPageState(PageStateType.Transfer)}
              >
                <FaRegPaperPlane color="white" size="1.5rem" />
              </Button>
            </Tooltip>
            <Tooltip label="View on BlockScout" aria-label="A tooltip">
              <Link
                href={`https://explorer.execution.l16.lukso.network/address/${vault.address}`}
                isExternal
                margin="0 !important"
              >
                <Button className={styles.NFTdetailButton}>
                  <FaBinoculars color="white" size="1.5rem" />
                </Button>
              </Link>
            </Tooltip>
          </HStack>
        ) : (
          <HStack className={styles.VaultDetailbuttonContainer}>
            <Tooltip label="View on BlockScout" aria-label="A tooltip">
              <Link
                href={`https://explorer.execution.l16.lukso.network/address/${vault.address}`}
                isExternal
                margin="0 !important"
              >
                <Button className={styles.NFTdetailButton}>
                  <FaBinoculars color="white" size="1.5rem" />
                </Button>
              </Link>
            </Tooltip>
          </HStack>
        )}
      </HStack>
      <VStack className={styles.vaultContentContainer} gap={7}>
        <HStack className={styles.vaultInnerContentContainer}>
          <VStack className={styles.vaultDetailContentContainer}>
            <Text className={styles.vaultBalanceLabel}>Vault Balance</Text>
            <Text
              className={styles.vaultBalanceAmount}
            >{`${vault.balance} LYX`}</Text>
            {/* <Text className={styles.vaultDetailSubtitle}>
              {vault.description}
            </Text> */}
          </VStack>
          <Image
            src={"vault2.png"}
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
                      {tokens.length}
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {!isTokensLoading &&
                  sortedTokens.map((token: any, idx: any) => (
                    <HStack key={idx} className={styles.vaultTokenListCell}>
                      <HStack className={styles.tokenListCellLeftSection}>
                        <Image
                          src={token.iconUrl}
                          alt={token.name}
                          className={styles.tokenImage}
                        />
                        <Text className={styles.tokenName}>{token.name}</Text>
                      </HStack>
                      <VStack className={styles.tokenListCellRightSection}>
                        {/* <Text className={styles.tokenFiatBalance}>
                          {token.balance}
                        </Text> */}
                        <Text
                          className={styles.tokenCryptoBalance}
                        >{`${token.balance} ${token.symbol}`}</Text>
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
                      {NFTs.length}
                    </Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {!isNFTsLoading && (
                  <SimpleGrid columns={3} spacing={0}>
                    {NFTs.map((nft: any, idx: any) => (
                      <VStack key={idx} className={styles.VaultNFTListCell}>
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
                    ))}
                  </SimpleGrid>
                )}
              </AccordionPanel>
            </AccordionItem>

            {/* TODO: there's some work needed to make permissions work properly */}
            {/* {!isToClaim && (
              <AccordionItem className={styles.accordionItem}>
                <h2>
                  <AccordionButton className={styles.accordionButton}>
                    <HStack flex="1">
                      <Text className={styles.NFTdetailTitle}>Permissions</Text>
                      <Text className={styles.NFTdetailSubtitle}>
                        {permissions.length}
                      </Text>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {permissions.map((permission, idx) => (
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
            )} */}
          </Accordion>
          {isToClaim && (
            <VStack>
              <HStack className={styles.vaultSwitchContainer}>
                <Switch
                  colorScheme="purple"
                  onChange={handleAgreeSwitch}
                  className={styles.vaultSwitch}
                />
                <Text className={styles.switchText}>
                  I understand there are risks involved in claiming this vault,
                  particularly in owning the assets that are held within.
                </Text>
                <Box w="1rem" h="1rem"></Box>
              </HStack>
              <HStack className={styles.buttonContainer}>
                <Button
                  className={styles.cancelButton}
                  onClick={() => switchPageState(PageStateType.Overview)}
                >
                  Cancel
                </Button>

                <Button
                  isDisabled={!agreed}
                  className={styles.sendButton}
                  onClick={handleClaim}
                >
                  {isClaimLoading ? <Spinner color="white" /> : "Claim"}
                </Button>
              </HStack>
              {errorMessage && (
                <Text
                  style={{ paddingTop: "1rem", color: "red" }}
                >{`Error: ${errorMessage}`}</Text>
              )}
            </VStack>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
};

const VaultDetailContainerWithTransition = withTransition(VaultDetailContainer);

type DepositVaultContainerProps = {
  vault: any;
  switchPageState: (pageState: PageStateType) => void;
  amount: string;
  setAmount: (amount: string) => void;
  handleSuccess: (txnHash: string) => void;
};

const DepositVaultContainer = ({
  vault,
  switchPageState,
  amount,
  setAmount,
  handleSuccess,
}: DepositVaultContainerProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedTokenName, setSelectedTokenName] = useState<string>("");
  const { web3, address, balance } = useLuksoWeb3();
  const { tokens, isLoading: isTokensLoading } = useOwnedTokens(address);
  const { NFTs, isLoading: isNFTsLoading } = useOwnedNFTs(address);
  const { transfer, isLoading: isTransferLoading } = useTransfer();

  if (isTokensLoading || isNFTsLoading) {
    return (
      <VStack className={styles.VaultDetailContainer}>
        <Box className={styles.detailContainerTitleBox}>
          <Text
            className={styles.detailContainerTitle}
          >{`Deposit into ${vault.name}`}</Text>
        </Box>
        <VStack h="10rem" justifyContent="center" alignItems="center">
          <Spinner color="white" size="lg" />
        </VStack>
      </VStack>
    );
  }

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

  const options = [...sortedTokens, ...NFTs];

  const selectedToken = selectedTokenName
    ? options.find((token) => token.name === selectedTokenName)
    : options[0];

  function handleSelectToken(e: any) {
    setSelectedTokenName(e.target.value);
  }

  function handleAmountChange(e: any) {
    setAmount(e.target.value);
  }

  function handleMaxAmount() {
    if (selectedToken.tokenType === "LSP7") {
      setAmount(selectedToken.balance ?? "0");
    } else {
      setAmount(balance ?? "0");
    }
  }

  async function handleDeposit() {
    if (!address) return;
    try {
      setErrorMessage("");
      const tx = await transfer(
        address,
        vault.address,
        amount,
        selectedToken,
        false
      );
      handleSuccess(tx.transactionHash);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  return (
    <VStack className={styles.VaultDetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text
          className={styles.detailContainerTitle}
        >{`Deposit into ${vault.name}`}</Text>
      </Box>
      <VStack className={styles.sendTokenContentContainer} gap={10}>
        {selectedToken.name === "LUKSO" ||
        selectedToken.tokenType === "LSP7" ? (
          <VStack>
            <HStack className={styles.depositTokenContainer}>
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
                <Button disabled className={styles.sendTokenMaxButton}>
                  <ArrowUpDownIcon color="white" w="20px" h="20px" />
                </Button>
              </Tooltip>
            </HStack>
            <Text
              className={styles.symbolLabel}
            >{`in ${selectedToken.symbol}`}</Text>
          </VStack>
        ) : (
          <HStack className={styles.depositTokenContainer}>
            <Image
              src={selectedToken.iconUrl}
              alt={"testing"}
              className={styles.NFTdetailImage}
            ></Image>
          </HStack>
        )}
        <VStack className={styles.selectTokenContainer}>
          <Text className={styles.recipientLabel}>Select Token</Text>
          <Select
            placeholder="LUKSO"
            className={styles.addressInput}
            onChange={handleSelectToken}
          >
            <option disabled>Crypto</option>
            <hr />
            {sortedTokens.map((option: any, idx: any) => (
              <option key={idx} value={option.name}>
                {option.name}
              </option>
            ))}
            <hr />
            <option disabled>NFTs</option>
            <hr />
            {NFTs.map((option: any, idx: any) => (
              <option key={idx} value={option.name}>
                {`${option.name} ${web3.utils.hexToString(option.tokenId)}`}
              </option>
            ))}
          </Select>
        </VStack>

        <HStack className={styles.buttonContainer}>
          <Button
            className={styles.cancelButton}
            onClick={() => switchPageState(PageStateType.Detail)}
          >
            Cancel
          </Button>
          <Button className={styles.sendButton} onClick={handleDeposit}>
            {isTransferLoading ? <Spinner color="white" /> : "Deposit"}
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

const DepositVaultContainerWithTransition = withTransition(
  DepositVaultContainer
);

type WithdrawVaultContainerProps = {
  vault: any;
  switchPageState: (pageState: PageStateType) => void;
  amount: string;
  setAmount: (amount: string) => void;
  handleSuccess: (txnHash: string) => void;
};

const WithdrawVaultContainer = ({
  vault,
  switchPageState,
  amount,
  setAmount,
  handleSuccess,
}: WithdrawVaultContainerProps) => {
  const { withdraw, isLoading: isWithdrawLoading } = useCreateVault();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedTokenName, setSelectedTokenName] = useState<string>("");
  const { tokens, isLoading: isTokensLoading } = useOwnedTokens(vault.address);
  const { NFTs, isLoading: isNFTsLoading } = useOwnedNFTs(vault.address);
  const { address, balance } = useLuksoWeb3();

  if (isTokensLoading || isNFTsLoading) {
    return (
      <VStack className={styles.VaultDetailContainer}>
        <Box className={styles.detailContainerTitleBox}>
          <Text
            className={styles.detailContainerTitle}
          >{`Withdraw from ${vault.name}`}</Text>
        </Box>
        <VStack h="10rem" justifyContent="center" alignItems="center">
          <Spinner color="white" size="lg" />
        </VStack>
      </VStack>
    );
  }
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

  const options = [...sortedTokens, ...NFTs];

  const selectedToken = selectedTokenName
    ? options.find((token) => token.name === selectedTokenName)
    : options[0];

  function handleSelectToken(e: any) {
    setSelectedTokenName(e.target.value);
  }

  function handleAmountChange(e: any) {
    setAmount(e.target.value);
  }

  function handleMaxAmount() {
    if (selectedToken.tokenType === "LSP7") {
      setAmount(selectedToken.balance ?? "0");
    } else {
      setAmount(balance ?? "0");
    }
  }

  async function handleWithdraw() {
    if (!address) return;
    try {
      setErrorMessage("");
      const tx = await withdraw(vault, amount, selectedToken);
      handleSuccess(tx.transactionHash);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  return (
    <VStack className={styles.VaultDetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text
          className={styles.detailContainerTitle}
        >{`Withdraw from ${vault.name}`}</Text>
      </Box>
      <VStack className={styles.sendTokenContentContainer} gap={10}>
        {selectedTokenName === "LUKSO" || selectedToken.tokenType === "LSP7" ? (
          <VStack>
            <HStack className={styles.depositTokenContainer}>
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
              <Button className={styles.sendTokenMaxButton}>
                <ArrowUpDownIcon color="white" w="20px" h="20px" />
              </Button>
            </HStack>
            <Text
              className={styles.symbolLabel}
            >{`in ${selectedToken.symbol}`}</Text>
          </VStack>
        ) : (
          <HStack className={styles.depositTokenContainer}>
            <Image
              src={selectedToken.iconUrl}
              alt={"testing"}
              className={styles.NFTdetailImage}
            ></Image>
          </HStack>
        )}
        <VStack className={styles.selectTokenContainer}>
          <Text className={styles.recipientLabel}>Select Token</Text>
          <Select
            placeholder="LUKSO"
            className={styles.addressInput}
            onChange={handleSelectToken}
          >
            <option disabled>Crypto</option>
            <hr />
            {sortedTokens.map((option: any, idx: any) => (
              <option key={idx} value={option.name}>
                {option.name}
              </option>
            ))}
            <hr />
            <option disabled>NFTs</option>
            <hr />
            {NFTs.map((option: any, idx: any) => (
              <option key={idx} value={option.name}>
                {option.name}
              </option>
            ))}
          </Select>
        </VStack>
        <HStack className={styles.buttonContainer}>
          <Button
            className={styles.cancelButton}
            onClick={() => switchPageState(PageStateType.Detail)}
          >
            Cancel
          </Button>
          <Button className={styles.sendButton} onClick={handleWithdraw}>
            {isWithdrawLoading ? <Spinner color="white" /> : "Withdraw"}
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

const WithdrawVaultContainerWithTransition = withTransition(
  WithdrawVaultContainer
);

type TransferVaultContainerProps = {
  vault: any;
  switchPageState: (pageState: PageStateType) => void;
  handleSuccess: (txnHash: string) => void;
};

const TransferVaultContainer = ({
  vault,
  switchPageState,
  handleSuccess,
}: TransferVaultContainerProps) => {
  const [recipient, setRecipient] = useState<string>("");
  const { transferVault, isLoading } = useVault();
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleRecipientChange(e: any) {
    setRecipient(e.target.value);
  }

  async function handleTransferVault() {
    if (!recipient) return;
    try {
      setErrorMessage("");
      const tx = await transferVault(recipient, vault);
      handleSuccess(tx.transactionHash);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  return (
    <VStack className={styles.VaultDetailContainer}>
      <Box className={styles.detailContainerTitleBox}>
        <Text
          className={styles.detailContainerTitle}
        >{`Transfer Ownership of Vault ${vault.name}`}</Text>
      </Box>
      <VStack className={styles.sendNFTContentContainer} gap={1}>
        <Image
          src="vault2.png"
          alt={vault.name}
          className={styles.vaultTransferDetailImage}
        ></Image>
        <VStack className={styles.vaultRecipientContainer}>
          <Text className={styles.NFTrecipientLabel}>Recipient</Text>
          <Input
            placeholder="Enter Address"
            className={styles.NFTaddressInput}
            onChange={handleRecipientChange}
          />
        </VStack>
        <Text className={styles.vaultTransferText}>
          * Please note: Transferring ownership will only be completed after the
          recipient claims ownership of this vault.
        </Text>
        <HStack className={styles.buttonContainer}>
          <Button
            className={styles.cancelButton}
            onClick={() => switchPageState(PageStateType.Detail)}
          >
            Cancel
          </Button>

          <Button className={styles.sendButton} onClick={handleTransferVault}>
            {isLoading ? <Spinner color="white" /> : "Transfer"}
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

const TransferVaultContainerWithTransition = withTransition(
  TransferVaultContainer
);

export default withTransition(VaultContainer);
