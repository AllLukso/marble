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
import { FaGithub, FaRegPaperPlane, FaBinoculars } from "react-icons/fa";
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

  const coverImageUrl = getIPFSUrl(backgroundImage[0].url);
  const profileImageUrl = getIPFSUrl(profileImage[0].url);

  return (
    <VStack className={styles.sidebarContainer}>
      <VStack>
        <Box className={styles.profileContainer}>
          <Box className={styles.coverImageOverlay}></Box>
          <Image
            src={coverImageUrl}
            alt="cover image"
            className={styles.coverImage}
          ></Image>
          <VStack className={styles.profileContentContainer}>
            <Image
              src={profileImageUrl}
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
              selected === "/#crypto" ? styles.selectedContainer : ""
            }`}
          >
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Crypto</Text>
          </HStack>
        </Link>
        <Link href="/#nft">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#nft" ? styles.selectedContainer : ""
            }`}
          >
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>NFTs</Text>
          </HStack>
        </Link>
        <Link href="/#vault">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#vault" ? styles.selectedContainer : ""
            }`}
          >
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Vaults</Text>
          </HStack>
        </Link>
        <Link href="/#staking">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#staking" ? styles.selectedContainer : ""
            }`}
          >
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Staking</Text>
          </HStack>
        </Link>
        <Link href="/#governance">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#governance" ? styles.selectedContainer : ""
            }`}
          >
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Governance</Text>
          </HStack>
        </Link>
        <Link href="/#settings">
          <HStack
            className={`${styles.sidebarTabContainer} ${
              selected === "/#settings" ? styles.selectedContainer : ""
            }`}
          >
            <FaGithub color="white" />
            <Text className={styles.sidebarTabTitle}>Settings</Text>
          </HStack>
        </Link>
      </VStack>
      <Text className={styles.sidebarFooter}>Made with ❤️ by @iamminci</Text>
    </VStack>
  );
};

export default SidebarContainer;
