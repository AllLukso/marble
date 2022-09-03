import { useState } from "react";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";
import LSP7DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json";
import LSP8IdentifiableDigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json";

// hook to transfer tokens
export default function useTransfer() {
  const [isLoading, setIsLoading] = useState(false);
  const { web3, balance } = useLuksoWeb3();

  async function transferLSP7(
    address: string,
    recipient: string,
    amount: string,
    token: any,
    force: boolean
  ) {
    const LSP7DigitalAssetContract = new web3.eth.Contract(
      LSP7DigitalAsset.abi,
      token.tokenContract._address
    );
    return await LSP7DigitalAssetContract.methods
      .transfer(
        address,
        recipient,
        web3.utils.toWei(amount, "ether"),
        force,
        "0x"
      )
      .send({ from: address });
  }

  async function transferLSP8(
    address: string,
    recipient: string,
    token: any,
    force: boolean
  ) {
    const LSP8DigitalAssetContract = new web3.eth.Contract(
      LSP8IdentifiableDigitalAsset.abi,
      token.tokenContract._address
    );
    return await LSP8DigitalAssetContract.methods
      .transfer(address, recipient, token.tokenId, force, "0x")
      .send({ from: address });
  }

  async function transfer(
    address: string,
    recipient: string,
    amount: string,
    token: any,
    force: boolean
  ) {
    setIsLoading(true);

    if (token.tokenType !== "LSP8" && (!amount || Number(amount) === 0)) {
      setIsLoading(false);
      throw new Error("Invalid amount");
    }

    // TODO: proper LSP7 balance handling
    if (Number(balance) < Number(amount)) {
      setIsLoading(false);
      throw new Error("Insufficient balance");
    }

    if (!web3.utils.isAddress(recipient)) {
      setIsLoading(false);
      throw new Error("Invalid recipient address");
    }

    try {
      let receipt;
      switch (token.tokenType) {
        case "LSP7":
          receipt = await transferLSP7(
            address,
            recipient,
            amount,
            token,
            force
          );
          break;
        case "LSP8":
          receipt = await transferLSP8(address, recipient, token, force);
          break;
        default:
          receipt = await web3.eth.sendTransaction({
            to: recipient,
            from: address,
            value: web3.utils.toWei(amount, "ether"),
          });
      }
      setIsLoading(false);
      return receipt;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }

  return { transfer, isLoading };
}
