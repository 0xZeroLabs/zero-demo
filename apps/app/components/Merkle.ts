import { MerkleTree } from "merkletreejs";
import { keccak256, toUtf8Bytes } from "ethers";

export const generateTree = async (list: string[]): Promise<MerkleTree> => {
  const leaves = list.map((items) => keccak256(toUtf8Bytes(items)));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  //
  //
  return tree;
};
