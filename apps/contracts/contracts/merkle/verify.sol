// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Merkle {
    function verify(
        bytes32 _root,
        bytes32[] memory _proof,
        bytes32 _leaf
    ) public pure returns (bool) {
        return MerkleProof.verify(_proof, _root, _leaf);
    }
}
