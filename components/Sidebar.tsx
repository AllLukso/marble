import styles from "../styles/Main.module.css";
import { VStack, HStack, Box, Text, Image } from "@chakra-ui/react";
import { FaCoins, FaImages, FaLock, FaSeedling, FaUsers } from "react-icons/fa";
import Link from "next/link";
import { getIPFSUrl, getUserHash } from "@utils/helpers";

type SidebarContainerProps = {
  address?: string;
  userProfile: any;
  selected: string;
};

const SidebarContainer = ({
  address,
  userProfile,
  selected,
}: SidebarContainerProps) => {
  if (!address || !userProfile) return null;

  const { name, profileImage, backgroundImage } = userProfile;

  const coverImageUrl = backgroundImage[0]
    ? getIPFSUrl(backgroundImage[0].url)
    : "";
  const profileImageUrl = profileImage[0]
    ? getIPFSUrl(profileImage[0].url)
    : "";

  return (
    <VStack className={styles.sidebarContainer}>
      <VStack>
        <Box className={styles.profileContainer}>
          <Box className={styles.coverImageOverlay}></Box>
          <Image
            src={coverImageUrl ?? "/cover.png"}
            alt="cover image"
            className={styles.coverImage}
          ></Image>
          <VStack className={styles.profileContentContainer}>
            <Image
              src={profileImageUrl ?? "/profile.png"}
              alt="cover image"
              className={styles.profileImage}
            ></Image>
            <HStack className={styles.profileNameContainer}>
              <Text className={styles.profileUsername}>{name}</Text>
              <Text className={styles.profileUserhash}>{`#${getUserHash(
                address
              )}`}</Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
      <VStack className={styles.sidebarTabListContainer}>
        <Link href="/#crypto">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#crypto" || selected === "/"
                ? styles.selectedContainer
                : ""
            }`}
          >
            <FaCoins color="white" />
            <Text className={styles.sidebarTabTitle}>Crypto</Text>
          </HStack>
        </Link>
        <Link href="/#nft">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#nft" ? styles.selectedContainer : ""
            }`}
          >
            <FaImages color="white" />
            <Text className={styles.sidebarTabTitle}>NFTs</Text>
          </HStack>
        </Link>
        <Link href="/#vault">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#vault" ? styles.selectedContainer : ""
            }`}
          >
            <FaLock color="white" />
            <Text className={styles.sidebarTabTitle}>Vaults</Text>
          </HStack>
        </Link>
        <Link href="/#staking">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#staking" ? styles.selectedContainer : ""
            }`}
          >
            <FaSeedling color="white" />
            <Text className={styles.sidebarTabTitle}>Staking</Text>
          </HStack>
        </Link>
        <Link href="/#governance">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#governance" ? styles.selectedContainer : ""
            }`}
          >
            <FaUsers color="white" />
            <Text className={styles.sidebarTabTitle}>Governance</Text>
          </HStack>
        </Link>
        {/* TODO: add settings to customize experience */}
        {/* <Link href="/#settings">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#settings" ? styles.selectedContainer : ""
            }`}
          >
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Settings</Text>
          </HStack>
        </Link> */}
      </VStack>
      <Text className={styles.sidebarFooter}>Made with ❤️ by @iamminci</Text>
    </VStack>
  );
};

export default SidebarContainer;
