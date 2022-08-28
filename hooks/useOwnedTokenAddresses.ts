import { useEffect, useState } from "react";

import ERC725js from "@erc725/erc725.js";

import LSP5ReceivedAssetsSchema from "@erc725/erc725.js/schemas/LSP5ReceivedAssets.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";

export default function useIssuedTokens(address: string) {
  const [tokenAddresses, setTokenAddresses] = useState<any>([]); // TODO figure out type here
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchIssuedTokenAddresses() {
      setIsLoading(true);

      const erc725LSP5IssuedAssets = new ERC725js(
        LSP5ReceivedAssetsSchema as ERC725JSONSchema[],
        address,
        window.web3.currentProvider
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
