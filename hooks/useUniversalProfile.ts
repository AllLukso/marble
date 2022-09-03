import { useEffect, useState } from "react";
import UniversalProfileSchema from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import { CONFIG, IPFS_GATEWAY_BASE_URL } from "../constants";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";

// hook to get universal profile data for a given address
export default function useUniversalProfile(address?: string) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { web3 } = useLuksoWeb3();

  const provider = web3.currentProvider;

  useEffect(() => {
    async function fetchUniversalProfile() {
      setIsLoading(true);
      if (address && provider) {
        const erc725 = new ERC725(
          UniversalProfileSchema as ERC725JSONSchema[],
          address,
          provider,
          CONFIG
        );

        try {
          const LSP3Profile = await erc725.fetchData(["LSP3Profile"]);
          if (LSP3Profile[0].value) {
            // @ts-ignore
            setUserProfile(LSP3Profile[0].value["LSP3Profile"]);
          } else {
            setUserProfile(false);
          }
        } catch (error) {
          console.log(error);
          setUserProfile(false);
        }
        setIsLoading(false);
      }
    }
    fetchUniversalProfile();
  }, [address, provider]);

  return { userProfile, isLoading };
}
