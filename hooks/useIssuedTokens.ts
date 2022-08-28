import { useEffect, useState } from "react";

import ERC725js from "@erc725/erc725.js";

import LSP4DigitalAssetSchema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import LSP12IssuedAssetsSchema from "@erc725/erc725.js/schemas/LSP12IssuedAssets.json";
import LSP7DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";

import {
  IPFS_GATEWAY_BASE_URL,
  COMMON_ABIS,
  INTERFACE_IDS,
} from "../constants";

import web3 from "web3";

export default function useIssuedTokens(address: string) {
  const [tokens, setTokens] = useState<any>([]); // TODO figure out type here
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchIssuedTokens() {
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
        const { value } = await erc725LSP12IssuedAssets.getData(
          "LSP12IssuedAssets[]"
        );

        const fetchedAddresses: any = value; // TODO: figure out type issue here

        const fetchedAssets = [];

        for (let i = 0; i < fetchedAddresses.length; i++) {
          const tokenAddress = fetchedAddresses[i];

          let LSP4TokenName,
            LSP4TokenSymbol,
            iconUrl,
            LSP4Metadata,
            totalSupply,
            creationType;

          const supportsInterfaceContract = new window.web3.eth.Contract(
            [COMMON_ABIS.supportsInterface],
            tokenAddress
          );

          const [isLSP7, isLSP8] = await Promise.all([
            await supportsInterfaceContract.methods
              .supportsInterface(INTERFACE_IDS.LSP7DigitalAsset)
              .call(),
            await supportsInterfaceContract.methods
              .supportsInterface(INTERFACE_IDS.LSP8IdentifiableDigitalAsset)
              .call(),
          ]);

          if (isLSP7) {
            creationType = "LSP7";
          }
          if (isLSP8) {
            creationType = "LSP8";
          }
          creationType = "unknown";

          // FETCH Metadata with erc725js
          // https://docs.lukso.tech/standards/nft-2.0/LSP4-Digital-Asset-Metadata
          const erc725Asset = new ERC725js(
            LSP4DigitalAssetSchema as ERC725JSONSchema[],
            tokenAddress,
            window.web3.currentProvider,
            config
          );

          const LSP4DigitalAsset = await erc725Asset.fetchData([
            "LSP4TokenName",
            "LSP4TokenSymbol",
            "LSP4Metadata",
          ]);

          LSP4TokenName = LSP4DigitalAsset[0].value;
          LSP4TokenSymbol = LSP4DigitalAsset[1].value;
          LSP4Metadata = LSP4DigitalAsset[2].value;

          const icons = LSP4Metadata.LSP4Metadata.icon;

          if (icons && icons.length > 0) {
            iconUrl = icons[0].url.replace("ipfs://", IPFS_GATEWAY_BASE_URL);
          }

          // READ supply with web3js
          const lsp4DigitalAssetContract = new window.web3.eth.Contract(
            LSP7DigitalAsset.abi,
            tokenAddress
          );

          // LSP7 and LSP8 both share the totalSupply function.
          totalSupply = isLSP7
            ? web3.utils.fromWei(
                await lsp4DigitalAssetContract.methods.totalSupply().call()
              )
            : await lsp4DigitalAssetContract.methods.totalSupply().call();

          fetchedAssets.push({
            LSP4TokenName,
            LSP4TokenSymbol,
            iconUrl,
            LSP4Metadata,
            totalSupply,
            creationType,
          });
        }
        setTokens(fetchedAssets);
      } catch (err) {
        console.log("Error fetching tokens: ", err);
      }
    }
    fetchIssuedTokens();
    setIsLoading(false);
  }, []);

  return { tokens, isLoading };
}
