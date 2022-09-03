import { useEffect, useState } from "react";
import ERC725js from "@erc725/erc725.js";
import LSP4DigitalAssetSchema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import LSP12IssuedAssetsSchema from "@erc725/erc725.js/schemas/LSP12IssuedAssets.json";
import LSP7DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";
import {
  COMMON_ABIS,
  INTERFACE_IDS,
  CONFIG,
  IPFS_GATEWAY_BASE_URL,
} from "../constants";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";

// hook to get token details issued by a given address
// inspo for a lot of this: https://github.com/lukso-network/example-dapp-lsps
export default function useIssuedTokens(address: string) {
  const [tokens, setTokens] = useState<any>([]); // TODO figure out type here
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { web3 } = useLuksoWeb3();

  useEffect(() => {
    setIsLoading(true);
    async function fetchIssuedTokens() {
      const erc725LSP12IssuedAssets = new ERC725js(
        LSP12IssuedAssetsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        CONFIG
      );

      try {
        const { value: fetchedAddresses } = await (<any>(
          erc725LSP12IssuedAssets.getData("LSP12IssuedAssets[]")
        ));

        const fetchedAssets = [];

        for (let i = 0; i < fetchedAddresses.length; i++) {
          const tokenAddress = fetchedAddresses[i];

          let name,
            symbol,
            iconUrl,
            description,
            metadata,
            totalSupply,
            creationType;

          const supportsInterfaceContract = new web3.eth.Contract(
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

          const erc725Asset = new ERC725js(
            LSP4DigitalAssetSchema as ERC725JSONSchema[],
            tokenAddress,
            web3.currentProvider,
            CONFIG
          );

          const LSP4DigitalAsset = await erc725Asset.fetchData([
            "LSP4TokenName",
            "LSP4TokenSymbol",
            "LSP4Metadata",
          ]);

          name = LSP4DigitalAsset[0].value;
          symbol = LSP4DigitalAsset[1].value;
          metadata = LSP4DigitalAsset[2].value as any;
          description = metadata.LSP4Metadata.description;

          const icons = metadata.LSP4Metadata.icon;

          if (icons && icons.length > 0) {
            iconUrl = icons[0].url.replace("ipfs://", IPFS_GATEWAY_BASE_URL);
          }

          const lsp4DigitalAssetContract = new web3.eth.Contract(
            LSP7DigitalAsset.abi,
            tokenAddress
          );

          totalSupply = isLSP7
            ? web3.utils.fromWei(
                await lsp4DigitalAssetContract.methods.totalSupply().call()
              )
            : await lsp4DigitalAssetContract.methods.totalSupply().call();

          fetchedAssets.push({
            name,
            symbol,
            iconUrl,
            metadata,
            description,
            totalSupply,
            creationType,
          });
        }
        setTokens(fetchedAssets);
        setIsLoading(false);
      } catch (err) {
        console.log("Error fetching tokens: ", err);
        setIsLoading(false);
      }
    }
    fetchIssuedTokens();
  }, [address]);

  return { tokens, isLoading };
}
