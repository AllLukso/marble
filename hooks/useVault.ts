import { useState } from "react";
import { useLuksoWeb3 } from "@components/LuksoWeb3Provider";
import ERC725js, { ERC725 } from "@erc725/erc725.js";
import LSP9Vault from "@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json";
import LSP6KeyManagerSchema from "@erc725/erc725.js/schemas/LSP6KeyManager.json";
import LSP10ReceivedVaultsSchema from "@erc725/erc725.js/schemas/LSP10ReceivedVaults.json";
import LSP1UniversalReceiverDelegateVault from "@lukso/lsp-smart-contracts/artifacts/LSP1UniversalReceiverDelegateVault.json";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import LSP6KeyManager from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import { ERC725JSONSchema } from "@erc725/erc725.js//build/main/src/types/ERC725JSONSchema";
import { OPERATION_TYPE, ERC725YKeys, CONFIG } from "../constants";
import useOwnedVaults from "@hooks/useOwnedVaults";
import LSP7DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json";
import LSP8IdentifiableDigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json";
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import db from "@firebase/firebase";

// hooks for all things vaults (apologizies in advance for the sloppy code)
export default function useVault() {
  const [isLoading, setIsLoading] = useState(false);
  const { web3, address, balance } = useLuksoWeb3();
  const { vaults } = useOwnedVaults(address);
  const [progress, setProgress] = useState(0);

  async function claimVault(vaultAddress: string) {
    setIsLoading(true);

    try {
      const erc725LSP6KeyManager = new ERC725js(
        LSP6KeyManagerSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        CONFIG
      );

      const LSP0UniversalProfileContract = new web3.eth.Contract(
        UniversalProfile.abi,
        address
      );

      const permissions = erc725LSP6KeyManager.encodePermissions({
        SIGN: true,
        SETDATA: true,
        CALL: true,
        STATICCALL: true,
      });

      const encodedData = erc725LSP6KeyManager.encodeData([
        {
          keyName: "AddressPermissions:Permissions:<address>",
          dynamicKeyParts: address,
          value: permissions,
        },
      ]);

      const fetchedPermissions = await LSP0UniversalProfileContract.methods[
        "getData(bytes32)"
      ](encodedData.keys[0]).call();

      if (fetchedPermissions !== permissions) {
        const txnReceipt = await LSP0UniversalProfileContract.methods[
          "setData(bytes32[],bytes[])"
        ](encodedData.keys, encodedData.values).send({
          from: address,
        });
        console.log("set data txn: ", txnReceipt);
      }

      const LSP9VaultContract = new web3.eth.Contract(
        LSP9Vault.abi,
        vaultAddress
      );

      const payloadFromVault = await LSP9VaultContract.methods
        .claimOwnership()
        .encodeABI();

      const encodedPayload = await LSP0UniversalProfileContract.methods
        .execute(0, vaultAddress, 0, payloadFromVault)
        .encodeABI();

      const keyManagerAddress = await LSP0UniversalProfileContract.methods
        .owner()
        .call();

      const LSP6KeyManagerContract = new web3.eth.Contract(
        LSP6KeyManager.abi,
        keyManagerAddress
      );

      const receipt = await LSP6KeyManagerContract.methods
        .execute(encodedPayload)
        .send({
          from: address,
        });

      const docRef = doc(db, "addresses", address);
      await updateDoc(docRef, {
        unclaimedVaults: arrayRemove(vaultAddress),
      });

      setIsLoading(false);
      return receipt;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }

  async function transferVault(newOwner: string, vault: any) {
    setIsLoading(true);

    if (address === newOwner) {
      setIsLoading(false);
      throw new Error("Recipient cannot be the same as the current owner");
    }

    if (!web3.utils.isAddress(newOwner)) {
      setIsLoading(false);
      throw new Error("Invalid recipient address");
    }

    try {
      const LSP9VaultContract = new web3.eth.Contract(
        LSP9Vault.abi,
        vault.address
      );

      const payloadFromVault = await LSP9VaultContract.methods
        .transferOwnership(newOwner)
        .encodeABI();

      const LSP0UniversalProfileContract = new web3.eth.Contract(
        UniversalProfile.abi,
        address
      );

      const encodedPayload = await LSP0UniversalProfileContract.methods
        .execute(0, vault.address, 0, payloadFromVault)
        .encodeABI();

      const keyManagerAddress = await LSP0UniversalProfileContract.methods
        .owner()
        .call();

      const LSP6KeyManagerContract = new web3.eth.Contract(
        LSP6KeyManager.abi,
        keyManagerAddress
      );

      const receipt = await LSP6KeyManagerContract.methods
        .execute(encodedPayload)
        .send({
          from: address,
        });

      const docRef = doc(db, "addresses", newOwner);
      await setDoc(docRef, {
        unclaimedVaults: arrayUnion(vault.address),
      });

      setIsLoading(false);
      return receipt;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }

  async function withdrawLukso(vault: any, amount: string) {
    const myVault = new web3.eth.Contract(LSP9Vault.abi, vault.address);

    return await myVault.methods
      .execute(
        OPERATION_TYPE.CALL,
        address,
        web3.utils.toWei(amount, "ether"),
        "0x"
      )
      .send({ from: address });
  }

  async function withdrawLSP7(vault: any, token: any, amount: string) {
    const LSP9VaultContract = new web3.eth.Contract(
      LSP9Vault.abi,
      vault.address
    );

    const LSP7DigitalAssetContract = new web3.eth.Contract(
      LSP7DigitalAsset.abi,
      token.tokenContract._address
    );

    const encodedPayload = await LSP7DigitalAssetContract.methods
      .transfer(
        vault.address,
        address,
        web3.utils.toWei(amount, "ether"),
        false,
        "0x"
      )
      .encodeABI();

    const payloadFromVault = await LSP9VaultContract.methods
      .execute(0, token.tokenContract._address, 0, encodedPayload)
      .encodeABI();

    const LSP0UniversalProfileContract = new web3.eth.Contract(
      UniversalProfile.abi,
      address
    );

    const payloadFromUP = await LSP0UniversalProfileContract.methods
      .execute(0, vault.address, 0, payloadFromVault)
      .encodeABI();

    const keyManagerAddress = await LSP0UniversalProfileContract.methods
      .owner()
      .call();

    const LSP6KeyManagerContract = new web3.eth.Contract(
      LSP6KeyManager.abi,
      keyManagerAddress
    );

    return await LSP6KeyManagerContract.methods.execute(payloadFromUP).send({
      from: address,
    });
  }

  async function withdrawLSP8(vault: any, token: any) {
    const LSP8DigitalAssetContract = new web3.eth.Contract(
      LSP8IdentifiableDigitalAsset.abi,
      token.tokenContract._address
    );

    const encodedPayload = await LSP8DigitalAssetContract.methods
      .transfer(vault.address, address, token.tokenId, false, "0x")
      .encodeABI();

    const LSP9VaultContract = new web3.eth.Contract(
      LSP9Vault.abi,
      vault.address
    );

    const payloadFromVault = await LSP9VaultContract.methods
      .execute(0, token.tokenContract._address, 0, encodedPayload)
      .encodeABI();

    const LSP0UniversalProfileContract = new web3.eth.Contract(
      UniversalProfile.abi,
      address
    );

    const payloadFromUP = await LSP0UniversalProfileContract.methods
      .execute(0, vault.address, 0, payloadFromVault)
      .encodeABI();

    const keyManagerAddress = await LSP0UniversalProfileContract.methods
      .owner()
      .call();

    const LSP6KeyManagerContract = new web3.eth.Contract(
      LSP6KeyManager.abi,
      keyManagerAddress
    );

    return await LSP6KeyManagerContract.methods.execute(payloadFromUP).send({
      from: address,
    });
  }

  async function withdraw(vault: any, amount: string, token: any) {
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

    try {
      let receipt;
      switch (token.tokenType) {
        case "LSP7":
          receipt = await withdrawLSP7(vault, token, amount);
          break;
        case "LSP8":
          receipt = await withdrawLSP8(vault, token);
          break;
        default:
          receipt = await withdrawLukso(vault, amount);
      }
      setIsLoading(false);
      return receipt;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }

  async function updateVaultMetadata() {
    const erc725LSP10ReceivedVaults = new ERC725js(
      LSP10ReceivedVaultsSchema as ERC725JSONSchema[],
      address,
      web3.currentProvider,
      CONFIG
    );

    try {
      const { value } = await (<any>(
        erc725LSP10ReceivedVaults.fetchData("LSP10Vaults[]")
      ));

      const newVaultAddress = value[0];

      const keyName = ERC725.encodeKeyName("VaultMetadata");

      const schema = [
        {
          name: "VaultMetadata",
          key: keyName,
          keyType: "Singleton",
          valueType: "bytes",
          valueContent: "JSONURL",
        },
      ];

      const vault = new ERC725js(
        schema as ERC725JSONSchema[],
        newVaultAddress,
        web3.currentProvider,
        CONFIG
      );

      const encodedData = vault.encodeData([
        {
          keyName: "VaultMetadata",
          value:
            "https://bafybeihhgzdqkdjvmbkqkelbt6clzj4pbj3e32d2ykskrddt4tp6klmvma.ipfs.w3s.link/sampleProfile.json",
        },
      ]);

      const LSP0UniversalProfileContract = new web3.eth.Contract(
        UniversalProfile.abi,
        address
      );

      const LSP9VaultContract = new web3.eth.Contract(
        LSP9Vault.abi,
        newVaultAddress
      );

      const abiPayload = await LSP9VaultContract.methods[
        "setData(bytes32[],bytes[])"
      ](encodedData.keys, encodedData.values).encodeABI();

      const txnReceipt = await LSP0UniversalProfileContract.methods
        .execute(abiPayload)
        .send({ from: address });

      return txnReceipt;
    } catch (err) {
      console.log(err);
    }
  }

  // note: there's 4-5 transactions involved in this operation
  async function createVault() {
    setIsLoading(true);
    let totalTxn = 4;
    let currentStep = 0;

    try {
      const erc725LSP6KeyManager = new ERC725js(
        LSP6KeyManagerSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        CONFIG
      );

      const LSP0UniversalProfileContract = new web3.eth.Contract(
        UniversalProfile.abi,
        address
      );

      const permissions = erc725LSP6KeyManager.encodePermissions({
        SIGN: true,
        SETDATA: true,
        CALL: true,
        STATICCALL: true,
      });

      const encodedData = erc725LSP6KeyManager.encodeData([
        {
          keyName: "AddressPermissions:Permissions:<address>",
          dynamicKeyParts: address,
          value: permissions,
        },
      ]);

      const fetchedPermissions = await LSP0UniversalProfileContract.methods[
        "getData(bytes32)"
      ](encodedData.keys[0]).call();

      if (fetchedPermissions !== permissions) {
        totalTxn++;
        const txnReceipt = await LSP0UniversalProfileContract.methods[
          "setData(bytes32[],bytes[])"
        ](encodedData.keys, encodedData.values).send({
          from: address,
        });
        setProgress(Number(((++currentStep / totalTxn) * 100).toFixed(0)));
        console.log("set data txn: ", txnReceipt);
      }

      const LSP9VaultContractTemplate = new web3.eth.Contract(LSP9Vault.abi);

      const { _address: newVaultAddress } =
        await LSP9VaultContractTemplate.deploy({
          data: LSP9Vault.bytecode,
          arguments: [address],
        }).send({
          from: address,
        });

      setProgress(Number(((++currentStep / totalTxn) * 100).toFixed(0)));

      const LSP1UDPVaultContract = new web3.eth.Contract(
        LSP1UniversalReceiverDelegateVault.abi
      );

      const { _address: URDAddress } = await LSP1UDPVaultContract.deploy({
        data: LSP1UniversalReceiverDelegateVault.bytecode,
      }).send({
        from: address,
      });

      setProgress(Number(((++currentStep / totalTxn) * 100).toFixed(0)));

      const LSP9VaultContract = new web3.eth.Contract(
        LSP9Vault.abi,
        newVaultAddress
      );

      const encodedPayload = await LSP9VaultContract.methods[
        "setData(bytes32,bytes)"
      ](ERC725YKeys.LSP0.LSP1UniversalReceiverDelegate, URDAddress).encodeABI();

      const payloadFromUP = await LSP0UniversalProfileContract.methods
        .execute(OPERATION_TYPE.CALL, newVaultAddress, 0, encodedPayload)
        .encodeABI();

      const keyManagerAddress = await LSP0UniversalProfileContract.methods
        .owner()
        .call();

      const LSP6KeyManagerContract = new web3.eth.Contract(
        LSP6KeyManager.abi,
        keyManagerAddress
      );

      await LSP6KeyManagerContract.methods.execute(payloadFromUP).send({
        from: address,
      });

      setProgress(Number(((++currentStep / totalTxn) * 100).toFixed(0)));

      const erc725LSP10ReceivedVaults = new ERC725js(
        LSP10ReceivedVaultsSchema as ERC725JSONSchema[],
        address,
        web3.currentProvider,
        CONFIG
      );

      const encodedVaultData = erc725LSP10ReceivedVaults.encodeData([
        {
          keyName: "LSP10Vaults[]",
          value: [
            ...vaults.map((vault: any) => vault.address),
            newVaultAddress,
          ],
        },
      ]);

      const payloadFromUP2 = await LSP0UniversalProfileContract.methods[
        "setData(bytes32[],bytes[])"
      ](encodedVaultData.keys, encodedVaultData.values).encodeABI();

      const receipt = await LSP6KeyManagerContract.methods
        .execute(payloadFromUP2)
        .send({
          from: address,
        });

      setProgress(Number(((++currentStep / totalTxn) * 100).toFixed(0)));

      setIsLoading(false);
      return receipt;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }

  return {
    createVault,
    updateVaultMetadata,
    withdraw,
    claimVault,
    transferVault,
    progress,
    isLoading,
  };
}
