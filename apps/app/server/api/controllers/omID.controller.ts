import { ethers } from "ethers";
import { abi } from "../utils/omID";

const config = useRuntimeConfig();
const tokenContract = config.omid;

export const mint = async (toAddress: string) => {
  const network = config.public.rpc;
  const provider = new ethers.JsonRpcProvider(network);

  const contract = new ethers.Contract(tokenContract, abi, provider);
  const signer = new ethers.Wallet(config.privateKey!, provider);

  
  const data = contract.interface.encodeFunctionData("mint", [toAddress]);

  // creating and sending the transaction object
  try {
    const tx = await signer.sendTransaction({
      to: tokenContract,
      from: signer.address,
      value: ethers.parseUnits("0.000", "ether"),
      data: data,
    });

    const receipt = await tx.wait();

    let hashData = {
      url: `https://sepolia.scrollscan.io/tx/${tx.hash}`,
      message: `Mined in block ${receipt!.blockNumber}`,
    };

    return hashData;
  } catch (error) {
    let hashData = {
      url: "",
      message: `Error: ${error}`,
    };

    return hashData;
  }
};

export const verify = async (toAddress: string, zkHash: string) => {
  const network = config.public.rpc;
  const provider = new ethers.JsonRpcProvider(network);

  const contract = new ethers.Contract(tokenContract, abi, provider);
  const signer = new ethers.Wallet(config.privateKey!, provider);

  
  const data = contract.interface.encodeFunctionData("verify", [
    toAddress,
    zkHash,
  ]);

  // creating and sending the transaction object
  try {
    const tx = await signer.sendTransaction({
      to: tokenContract,
      from: signer.address,
      value: ethers.parseUnits("0.000", "ether"),
      data: data,
    });

    const receipt = await tx.wait();

    let hashData = {
      url: `https://sepolia.scrollscan.io/tx/${tx.hash}`,
      message: `Mined in block ${receipt!.blockNumber}`,
    };

    return hashData;
  } catch (error) {
    let hashData = {
      url: "",
      message: `Error: ${error}`,
    };

    return hashData;
  }
};

export const hasSoul = async (toAddress: string) => {
  const network = config.public.rpc;
  const provider = new ethers.JsonRpcProvider(network);

  const contract = new ethers.Contract(tokenContract, abi, provider);

  

  // creating and sending the transaction object
  try {
    const _hasSoul = await contract.hasSoul(toAddress);
    

    let hashData = {
      pass: _hasSoul,
    };

    return hashData;
  } catch (error) {
    let hashData = {
      url: "",
      message: `Error: ${error}`,
      pass: false,
    };

    return hashData;
  }
};

export const isVerified = async (toAddress: string) => {
  const network = config.public.rpc;
  const provider = new ethers.JsonRpcProvider(network);

  const contract = new ethers.Contract(tokenContract, abi, provider);

  

  // creating and sending the transaction object
  try {
    const _isVerified = await contract.isVerified(toAddress);
    
    

    let hashData = {
      pass: _isVerified,
    };

    return hashData;
  } catch (error) {
    let hashData = {
      url: "",
      message: `Error: ${error}`,
      pass: false,
    };

    return hashData;
  }
};

export const getSoul = async (toAddress: string) => {
  const network = config.public.rpc;
  const provider = new ethers.JsonRpcProvider(network);

  const contract = new ethers.Contract(tokenContract, abi, provider);

  // creating and sending the transaction object
  try {
    let arr: any[] = [];
    
    return (await contract.getSoul(toAddress)).map((value: any) => value.toString());
  } catch (error) {
    return [];
  }
};