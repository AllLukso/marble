import { useEffect, useState } from "react";

import UniversalProfileSchema from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import { IPFS_GATEWAY_BASE_URL } from "../constants";

export default function useUniversalProfile(address?: string) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const provider = window.web3.currentProvider;

  useEffect(() => {
    async function fetchUniversalProfile() {
      setIsLoading(true);
      if (address && provider) {
        const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

        const erc725 = new ERC725(
          UniversalProfileSchema as ERC725JSONSchema[],
          address,
          provider,
          config
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
