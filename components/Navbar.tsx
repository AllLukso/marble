import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { Button, HStack, Image, Spinner } from "@chakra-ui/react";
import { abridgeAddress } from "@utils/helpers";
import { useState } from "react";
import { useLuksoWeb3 } from "./LuksoWeb3Provider";

const Navbar = () => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address, setAddress } = useLuksoWeb3();

  function handleDisconnect() {
    setIsLoading(true);
    setTimeout(() => {
      setAddress("");
      window.localStorage.removeItem("MARBLE_ADDRESS");
      setIsLoading(false);
    }, 800);
  }

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
          onClick={handleDisconnect}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {isLoading ? (
            <Spinner color="white" />
          ) : isHover ? (
            "Disconnect"
          ) : (
            abridgeAddress(address)
          )}
        </Button>
      )}
    </HStack>
  );
};

export default Navbar;
