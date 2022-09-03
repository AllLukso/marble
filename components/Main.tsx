import styles from "../styles/Main.module.css";
import {
  VStack,
  HStack,
  Text,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import SidebarContainer from "@components/Sidebar";
import CryptoContainer from "@components/Crypto";
import NFTContainer from "@components/NFT";
import VaultContainer from "@components/Vault";
import BalanceContainer from "@components/Balance";
import ComingSoonContainer from "@components/ComingSoon";
import useUniversalProfile from "hooks/useUniversalProfile";
import withTransition from "@components/withTransition";
import { useLuksoWeb3 } from "./LuksoWeb3Provider";

const Main = () => {
  const router = useRouter();
  const { address } = useLuksoWeb3();

  const { userProfile, isLoading: isLoadingProfile } =
    useUniversalProfile(address);

  function getContent() {
    switch (router.asPath) {
      case "/":
        return <CryptoContainer address={address} />;
      case "/#crypto":
        return <CryptoContainer address={address} />;
      case "/#nft":
        return <NFTContainer address={address} />;
      case "/#vault":
        return <VaultContainer address={address} />;
      case "/#staking":
        return <ComingSoonContainer title="Staking" />;
      case "/#governance":
        return <ComingSoonContainer title="Governance" />;
      default:
        return <CryptoContainer />;
    }
  }

  return (
    <div className={styles.container}>
      {isLoadingProfile ? (
        <VStack className={styles.loadingProfile}>
          <Spinner color="white" size="lg" />
          <Text color="white">Loading Universal Profile...</Text>
        </VStack>
      ) : userProfile === false ? (
        <VStack className={styles.loadingProfile}>
          <Text color="white">
            The address you've connected with is not a LUKSO Universal Profile,
            please try again.
          </Text>
          <ChakraLink
            href="https://docs.lukso.tech/guides/browser-extension/install-browser-extension/"
            isExternal
          >
            <Text color="white">
              If you do not have a Universal Profile yet, click here to install
              the extension and create one.
            </Text>
          </ChakraLink>
        </VStack>
      ) : (
        <HStack className={styles.contentContainer} gap={2}>
          <SidebarContainer
            address={address}
            userProfile={userProfile}
            selected={router.asPath}
          />
          <VStack className={styles.mainContainer} gap={2}>
            <BalanceContainer address={address} userProfile={userProfile} />
            {getContent()}
          </VStack>
        </HStack>
      )}
    </div>
  );
};

export default withTransition(Main);
