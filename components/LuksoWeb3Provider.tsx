import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

/*

HOW THIS WORKS:
0. We want all child components to access the web3 object and saved address
1. We first create the context and initialize it to an empty state
2. Then we fetch the injected provider from UP extension, instantiate the Web3 object, and set it to context
3. We can now use the useLuksoWeb3 hook to access the Web3 object anywhere in our app
4. Furthermore, once we save the user's address from the Landing page, we can use that anywhere as well

*/

type LuksoWeb3ContextType = {
  web3: any;
  address: string;
  setAddress: (address: string) => void;
  balance: string;
};

const initContext: LuksoWeb3ContextType = {
  web3: null,
  address: "",
  setAddress: () => {},
  balance: "",
};

const LuksoWeb3Context = createContext<LuksoWeb3ContextType>(initContext);

// hook that allows any component to access the Lukso Web3 context
export const useLuksoWeb3 = () => useContext(LuksoWeb3Context);

export const LuksoWeb3Provider = ({ children }: any) => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  let web3: any = null;

  // givenProvider is window.ethereum under the hood
  // @ts-expect-errorts-ignore
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(Web3.givenProvider);
  }

  // hook to handle address changes
  useEffect(() => {
    const fetchedAddress = window.localStorage.getItem("MARBLE_ADDRESS");
    if (!address && fetchedAddress) setAddress(fetchedAddress);
    if (address && address !== fetchedAddress)
      window.localStorage.setItem("MARBLE_ADDRESS", address);
  }, [address]);

  // hook to handle balance changes
  useEffect(() => {
    async function fetchBalance() {
      if (!web3 || !address) return;
      const fetchedBalance = await web3.eth.getBalance(address);
      const formattedBalance = web3.utils.fromWei(fetchedBalance, "ether");
      setBalance(formattedBalance);
    }
    fetchBalance();
  }, [address, web3]);

  return (
    <LuksoWeb3Context.Provider value={{ web3, address, setAddress, balance }}>
      {children}
    </LuksoWeb3Context.Provider>
  );
};
