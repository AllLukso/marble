import { useEffect, useState } from "react";
import ERC725js from "@erc725/erc725.js";
import LSP10ReceivedVaultsSchema from "@erc725/erc725.js/schemas/LSP10ReceivedVaults.json";
import LSP9Vault from "@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";
import { CONFIG } from "../constants";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";
import { abridgeAddress } from "@utils/helpers";

// hook to fetch all vaults owned by a given user
export default function useOwnedVaults(address?: string) {
  const [vaults, setVaults] = useState<any>([]);
  const { web3, balance } = useLuksoWeb3();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!address) return;
    setIsLoading(true);

    async function fetchOwnedVaults() {
      const erc725LSP10ReceivedVaults = new ERC725js(
        LSP10ReceivedVaultsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        CONFIG
      );

      const fetchedVaults = [];

      try {
        const { value: fetchedAddresses } = await (<any>(
          erc725LSP10ReceivedVaults.fetchData("LSP10Vaults[]")
        ));

        const uniqueAddresses = fetchedAddresses.filter(
          (v: any, i: any, a: any[]) => a.indexOf(v) === i
        );

        for (let i = 0; i < uniqueAddresses.length; i++) {
          const vaultAddress = uniqueAddresses[i];

          if (!web3 || !address) return;

          const LSP9VaultContract = new web3.eth.Contract(
            LSP9Vault.abi,
            vaultAddress
          );

          const result = await LSP9VaultContract.methods.owner().call();

          if (result !== address) continue;

          const fetchedBalance = await web3.eth.getBalance(vaultAddress);
          const formattedBalance = web3.utils.fromWei(fetchedBalance, "ether");

          fetchedVaults.push({
            name: abridgeAddress(vaultAddress),
            address: vaultAddress,
            balance: formattedBalance,
          });
        }

        setVaults(fetchedVaults);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    }
    fetchOwnedVaults();
  }, [address]);

  return { vaults, isLoading };
}
