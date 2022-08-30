import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { HStack, Image } from "@chakra-ui/react";
// import { HamburgerIcon } from "@chakra-ui/icons";
// import { useAccount } from "wagmi";

const Navbar = () => {
  // const { address } = useAccount();

  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="marble Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image>
      </Link>
      {/* <HStack gap={2}>
        <HamburgerIcon
          onClick={onOpen}
          className={styles.hamburgerButton}
          w={7}
          h={7}
        />
      </HStack> */}
    </HStack>
  );
};

export default Navbar;
