import { useEffect, useState } from "react";

import ERC725js from "@erc725/erc725.js";

import LSP12IssuedAssetsSchema from "@erc725/erc725.js/schemas/LSP12IssuedAssets.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";

import { IPFS_GATEWAY_BASE_URL } from "../constants";

export default function useIssuedTokens(address: string) {
  const [tokenAddresses, setTokenAddresses] = useState<any>([]); // TODO figure out type here
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchIssuedTokenAddresses() {
      setIsLoading(true);

      const config = {
        ipfsGateway: IPFS_GATEWAY_BASE_URL,
      };

      const erc725LSP12IssuedAssets = new ERC725js(
        LSP12IssuedAssetsSchema as ERC725JSONSchema[],
        address,
        window.web3.currentProvider,
        config
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
