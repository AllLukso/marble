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

export default SidebarContainer;
