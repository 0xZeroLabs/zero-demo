import { MerkleTree } from "merkletreejs";
import { keccak256, toUtf8Bytes } from "ethers";

export const generateTree = async (list: string[]): Promise<MerkleTree> => {
  const leaves = list.map((items) => keccak256(toUtf8Bytes(items)));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  //console.log(`Root: ${tree.getHexRoot()}`);
  //console.log(`Proof: ${tree.getHexProof(keccak256(toUtf8Bytes(list[0])))}, Leaf: ${keccak256(toUtf8Bytes(list[0]))}`);
  return tree;
};
