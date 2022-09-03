import { Link, Text } from "@chakra-ui/react";
import styles from "../styles/Main.module.css";

const CustomToast = ({ txnHash }: any) => {
  return (
    <Link
      href={`https://explorer.execution.l16.lukso.network/tx/${txnHash}`}
      isExternal
    >
      <Text className={styles.toastText}>
        🎉 Transaction Success!
        <br />
        View details on BlockScout
      </Text>
    </Link>
  );
};

export default CustomToast;
