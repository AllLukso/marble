import { useEffect, useState } from "react";
import ERC725js from "@erc725/erc725.js";
import LSP4DigitalAssetSchema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import LSP5ReceivedAssetsSchema from "@erc725/erc725.js/schemas/LSP5ReceivedAssets.json";
import LSP7DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";
import {
  IPFS_GATEWAY_BASE_URL,
  COMMON_ABIS,
  INTERFACE_IDS,
  CONFIG,
} from "../constants";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";

// hook to fetch all tokens owned by a given user
// inspo for a lot of this: https://github.com/lukso-network/example-dapp-lsps
export default function useOwnedTokens(address?: string) {
  const [tokens, setTokens] = useState<any>([]);
  const { web3 } = useLuksoWeb3();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!address) return;
    setIsLoading(true);

    async function fetchOwnedTokens() {
      const erc725LSP5ReceivedAssets = new ERC725js(
        LSP5ReceivedAssetsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider
      );

      try {
        const { value: fetchedAddresses } = await (<any>(
          erc725LSP5ReceivedAssets.getData("LSP5ReceivedAssets[]")
        ));

        const fetchedTokens = [];

        for (let i = 0; i < fetchedAddresses.length; i++) {
          const tokenAddress = fetchedAddresses[i];

          let name, symbol, iconUrl, metadata, totalSupply, balance;

          const supportsInterfaceContract = new web3.eth.Contract(
            [COMMON_ABIS.supportsInterface],
            tokenAddress
          );

          const isLSP7 = await supportsInterfaceContract.methods
            .supportsInterface(INTERFACE_IDS.LSP7DigitalAsset)
            .call();

          if (!isLSP7) continue;

          const erc725LSP4DigitalAsset = new ERC725js(
            LSP4DigitalAssetSchema as ERC725JSONSchema[],
            tokenAddress,
            web3.currentProvider,
            CONFIG
          );

          const LSP4DigitalAsset = await erc725LSP4DigitalAsset.fetchData([
            "LSP4TokenName",
            "LSP4TokenSymbol",
            "LSP4Metadata",
          ]);

          name = LSP4DigitalAsset[0].value;
          symbol = LSP4DigitalAsset[1].value;
          metadata = LSP4DigitalAsset[2].value as any;

          const icons = metadata.LSP4Metadata.icon;

          if (icons && icons.length > 0) {
            iconUrl = icons[0].url.replace("ipfs://", IPFS_GATEWAY_BASE_URL);
          }

          const LSP4DigitalAssetContract = new web3.eth.Contract(
            LSP7DigitalAsset.abi,
            tokenAddress
          );

          totalSupply = web3.utils.fromWei(
            await LSP4DigitalAssetContract.methods.totalSupply().call()
          );

          balance = web3.utils.fromWei(
            await LSP4DigitalAssetContract.methods.balanceOf(address).call()
          );

          fetchedTokens.push({
            name,
            symbol,
            iconUrl,
            metadata,
            totalSupply,
            balance,
            tokenType: "LSP7",
            tokenContract: LSP4DigitalAssetContract,
          });
        }

        const luksoBalance = web3.utils.fromWei(
          await web3.eth.getBalance(address),
          "ether"
        );

        // add LUKSO to fetched tokens list
        if (luksoBalance > 0) {
          fetchedTokens.push({
            name: "LUKSO",
            symbol: "LYX.t",
            iconUrl:
              "https://s2.coinmarketcap.com/static/img/coins/64x64/5625.png",
            metadata: {},
            totalSupply: 100000000,
            balance: luksoBalance,
            tokenType: "native",
            tokenContract: null,
          });
        }

        setTokens(fetchedTokens);
        setIsLoading(false);
      } catch (err) {
        console.log("Error fetching tokens: ", err);
        setIsLoading(false);
      }
    }
    fetchOwnedTokens();
  }, [address]);

  return { tokens, isLoading };
}
