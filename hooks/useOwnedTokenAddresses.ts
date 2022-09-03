import { useEffect, useState } from "react";
import ERC725js from "@erc725/erc725.js";
import LSP5ReceivedAssetsSchema from "@erc725/erc725.js/schemas/LSP5ReceivedAssets.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";

// hook to get token addresses owned by a given address
// inspo for a lot of this: https://github.com/lukso-network/example-dapp-lsps
export default function useOwnedTokens(address: string) {
  const [tokenAddresses, setTokenAddresses] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { web3 } = useLuksoWeb3();

  useEffect(() => {
    async function fetchIssuedTokenAddresses() {
      setIsLoading(true);

      const erc725LSP5IssuedAssets = new ERC725js(
        LSP5ReceivedAssetsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider
      );

      try {
        const { value: fetchedAddresses } =
          await erc725LSP5IssuedAssets.getData("LSP5ReceivedAssets[]");

        setTokenAddresses(fetchedAddresses);
      } catch (err) {
        console.log("Error fetching tokens: ", err);
      }
    }
    fetchIssuedTokenAddresses();
    setIsLoading(false);
  }, []);

  return { tokenAddresses, isLoading };
}
