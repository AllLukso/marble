import { useEffect, useState } from "react";
import ERC725js from "@erc725/erc725.js";
import LSP12IssuedAssetsSchema from "@erc725/erc725.js/schemas/LSP12IssuedAssets.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";
import { CONFIG } from "../constants";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";

// hook to get token addresses issued by a given address
// inspo for a lot of this: https://github.com/lukso-network/example-dapp-lsps
export default function useIssuedTokens(address: string) {
  const [tokenAddresses, setTokenAddresses] = useState<any>([]); // TODO figure out type here
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { web3 } = useLuksoWeb3();

  useEffect(() => {
    async function fetchIssuedTokenAddresses() {
      setIsLoading(true);

      const erc725LSP12IssuedAssets = new ERC725js(
        LSP12IssuedAssetsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        CONFIG
      );

      try {
        const { value: fetchedAssets } = await erc725LSP12IssuedAssets.getData(
          "LSP12IssuedAssets[]"
        );

        setTokenAddresses(fetchedAssets);
      } catch (err) {
        console.log("Error fetching tokens: ", err);
      }
    }
    fetchIssuedTokenAddresses();
    setIsLoading(false);
  }, []);

  return { tokenAddresses, isLoading };
}
