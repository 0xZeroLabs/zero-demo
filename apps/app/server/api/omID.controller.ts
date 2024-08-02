import { ethers } from "ethers";
import { abi } from "./omID";

const config = useRuntimeConfig();
const tokenContract = "0x46566A05D468109793CD18afB8D8f67FdEB0a97F";

export const mint = async (toAddress: string) => {
  const network = config.public.rpc;
  const provider = new ethers.JsonRpcProvider(network);

  const contract = new ethers.Contract(tokenContract, abi, provider);
  const signer = new ethers.Wallet(config.public.privateKey!, provider);

  console.log(toAddress);
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
      url: `https://sepolia.etherscan.io/tx/${tx.hash}`,
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

  console.log(toAddress);

  // creating and sending the transaction object
  try {
    const _hasSoul = (await contract.hasSoul(toAddress));
    console.log(_hasSoul)

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

  console.log(toAddress);

  // creating and sending the transaction object
  try {
    const _isVerified = (await contract.isVerified(toAddress));
    console.log(_isVerified)
    console.log("data:", (await contract.getSoul(toAddress))[0])

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
