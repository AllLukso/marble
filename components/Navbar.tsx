import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { Button, HStack, Image } from "@chakra-ui/react";
import { useAccount, useDisconnect } from "wagmi";
import { abridgeAddress } from "@utils/helpers";
import { useState } from "react";

const Navbar = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isHover, setIsHover] = useState<boolean>(false);

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
      {address && (
        <Button
          className={styles.addressButton}
          onClick={() => disconnect?.()}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {isHover ? "Disconnect" : abridgeAddress(address)}
        </Button>
      )}
    </HStack>
  );
};

export default Navbar;
