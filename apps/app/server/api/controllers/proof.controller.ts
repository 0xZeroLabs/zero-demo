import { ethers } from "ethers";
import { abi } from "../utils/groth16";

const config = useRuntimeConfig();
const tokenContract = config.groth16;

export const verifyProof = async (proof: string[]) => {
  const network = config.public.rpc;
  const provider = new ethers.JsonRpcProvider(network);

  const contract = new ethers.Contract(tokenContract, abi, provider);

  // creating and sending the transaction object
  try {
    let arr: any[] = [];

    return (await contract.verifyProof(proof[0], proof[1], proof[2], proof[3]));
  } catch (error) {
    return [];
  }
};
