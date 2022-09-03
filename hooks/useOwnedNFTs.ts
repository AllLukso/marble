import { useEffect, useState } from "react";
import ERC725js from "@erc725/erc725.js";
import LSP4DigitalAssetSchema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import LSP5ReceivedAssetsSchema from "@erc725/erc725.js/schemas/LSP5ReceivedAssets.json";
import LSP8IdentifiableDigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";
import { CONFIG, INTERFACE_IDS, IPFS_GATEWAY_BASE_URL } from "../constants";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";

const LSP8MetadataJSONSchema = {
  name: "LSP8MetadataJSON:<bytes32>",
  key: "0x9a26b4060ae7f7d5e3cd0000<bytes32>",
  keyType: "Mapping",
  valueType: "bytes",
  valueContent: "JSONURL",
};

// hook to fetch all NFTs owned by a given user
export default function useOwnedNFTs(address?: string) {
  const [collections, setCollections] = useState<any>([]);
  const [NFTs, setNFTs] = useState<any>([]);
  const { web3, balance } = useLuksoWeb3();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!address) return;
    setIsLoading(true);

    async function fetchOwnedNFTs() {
      const erc725LSP5ReceivedAssets = new ERC725js(
        LSP5ReceivedAssetsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider
      );

      try {
        const { value: fetchedAddresses } = await (<any>(
          erc725LSP5ReceivedAssets.getData("LSP5ReceivedAssets[]")
        ));

        const fetchedNFTs = [];
        const fetchedCollections = [];

        for (let i = 0; i < fetchedAddresses.length; i++) {
          const tokenAddress = fetchedAddresses[i];

          const LSP8IdentifiableDigitalAssetContract = new web3.eth.Contract(
            LSP8IdentifiableDigitalAsset.abi,
            tokenAddress
          );

          const isLSP8 = await LSP8IdentifiableDigitalAssetContract.methods
            .supportsInterface(INTERFACE_IDS.LSP8IdentifiableDigitalAsset)
            .call();

          if (!isLSP8) continue;

          const tokenIds = await LSP8IdentifiableDigitalAssetContract.methods
            .tokenIdsOf(address)
            .call();

          let collectionName;
          let collectionSymbol;

          for (let i = 0; i < tokenIds.length; i++) {
            const fetchedTokenId = tokenIds[i];

            const erc725LSP4DigitalAsset = new ERC725js(
              [
                ...LSP4DigitalAssetSchema,
                LSP8MetadataJSONSchema,
              ] as ERC725JSONSchema[],
              tokenAddress,
              web3.currentProvider,
              CONFIG
            );

            const LSP4DigitalAsset = await erc725LSP4DigitalAsset.fetchData([
              "LSP4TokenName",
              "LSP4TokenSymbol",
              {
                keyName: "LSP8MetadataJSON:<bytes32>",
                dynamicKeyParts: fetchedTokenId,
              },
              "LSP4Metadata",
            ]);

            collectionName = LSP4DigitalAsset[0].value;
            collectionSymbol = LSP4DigitalAsset[1].value;

            const name = LSP4DigitalAsset[0].value;
            const symbol = LSP4DigitalAsset[1].value;
            const metadata = LSP4DigitalAsset[2].value as any;
            const description = metadata.LSP4Metadata.description;

            const icons = metadata.LSP4Metadata.icon;

            let iconUrl;
            if (icons && icons.length > 0) {
              iconUrl = icons[0].url.replace("ipfs://", IPFS_GATEWAY_BASE_URL);
            }

            const LSP4DigitalAssetContract = new web3.eth.Contract(
              LSP8IdentifiableDigitalAsset.abi,
              tokenAddress
            );

            const totalSupply = await LSP4DigitalAssetContract.methods
              .totalSupply()
              .call();

            const balance = await LSP4DigitalAssetContract.methods
              .balanceOf(address)
              .call();

            fetchedNFTs.push({
              name,
              symbol,
              iconUrl,
              metadata,
              description,
              totalSupply,
              balance,
              tokenType: "LSP8",
              tokenId: fetchedTokenId, // TODO: support more complex tokenId types
              tokenContract: LSP4DigitalAssetContract,
            });
          }

          fetchedCollections.push({
            collectionName,
            collectionSymbol,
            balance: tokenIds.length,
          });
        }

        setNFTs(fetchedNFTs);
        setCollections(fetchedCollections);
        setIsLoading(false);
      } catch (err) {
        console.log("Error fetching tokens: ", err);
        setIsLoading(false);
      }
    }
    fetchOwnedNFTs();
  }, [address]);

  return { NFTs, collections, isLoading };
}
