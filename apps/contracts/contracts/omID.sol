// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * An experiment in Soul Bound Tokens (SBT's) following Vitalik's
 * co-authored whitepaper at:
 * https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763
 *
 * Edited to include created and updated timestamps
 * Based around ERC721 standards
 */

// burning and updating across chain has to be implemented with the help of a registry for wallets
contract omID is ERC721, ERC721URIStorage {
    uint256 private _tokenIdCounter;

    enum VerificationStatus {
        Pending,
        Verified,
        RE,
        Blacklisted
    }

    struct State {
        address id;
        address soul;
    }

    struct Soul {
        // contains zKYC Hash
        string identity;
        // add issuer specific fields below
        uint256 score;
        VerificationStatus status;
        uint256 created;
        uint256 updated;
    }

    mapping(address => Soul) private souls;
    mapping(address => mapping(address => Soul)) soulProfiles;
    mapping(address => address[]) private profiles;

    address public operator;
    string private ipfsCID;
    bytes32 private zeroHash =
        0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563;
    bytes32 private zeroHash2 =
        0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;

    event Mint(address _soul);
    event Burn(address _soul);
    event Update(address _soul);
    event SetProfile(address _profiler, address _soul);
    event RemoveProfile(address _profiler, address _soul);

    constructor(string memory _ipfsCID) ERC721("Omni-Identity", "omID") {
        operator = msg.sender;
        ipfsCID = _ipfsCID;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Token not transferable");
        super._update(to, tokenId, auth);
        return from;
    }

    function mint(address _soul) external {
        require(
            keccak256(abi.encode(souls[_soul].created)) == zeroHash,
            "Soul already exists"
        );
        require(msg.sender == operator, "Only operator can mint new souls");
        souls[_soul].status = VerificationStatus.Pending;
        souls[_soul].created = block.timestamp;
        _tokenIdCounter += 1;
        _setTokenURI(_tokenIdCounter, string(abi.encodePacked("ipfs://", ipfsCID)));
        _mint(_soul, _tokenIdCounter);
        emit Mint(_soul);
    }

    function burn(address _soul) external {
        require(
            msg.sender == _soul || msg.sender == operator,
            "Only users and issuers have rights to delete their data"
        );
        require(
            keccak256(abi.encode(souls[_soul].created)) != zeroHash,
            "Soul does not exist"
        );
        delete souls[_soul];
        for (uint256 i = 0; i < profiles[_soul].length; i++) {
            address profiler = profiles[_soul][i];
            delete soulProfiles[profiler][_soul];
        }
        emit Burn(_soul);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return
            interfaceId == bytes4(0x49064906) ||
            super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        tokenId = 1;
        return super.tokenURI(tokenId);
    }

    function update(address _soul, Soul memory _soulData) external {
        require(msg.sender == operator, "Only operator can update soul data");
        require(
            keccak256(abi.encode(souls[_soul].created)) != zeroHash,
            "Soul does not exist"
        );
        souls[_soul] = _soulData;
        souls[_soul].updated = block.timestamp;
        emit Update(_soul);
    }

    function verify(address _soul, string memory _id) external {
        require(msg.sender == operator, "Only operator can update soul data");
        require(
            keccak256(abi.encode(souls[_soul].created)) != zeroHash,
            "Soul does not exist"
        );
        require(
            keccak256(abi.encodePacked(souls[_soul].identity)) !=
                keccak256(abi.encodePacked(_id)),
            "Identity already exists"
        );
        souls[_soul].identity = _id;
        souls[_soul].status = VerificationStatus.Verified;
        souls[_soul].updated = block.timestamp;
        emit Update(_soul);
    }

    function hasSoul(address _soul) external view returns (bool) {
        if (keccak256(abi.encode(souls[_soul].created)) == zeroHash) {
            return false;
        } else {
            return true;
        }
    }

    function isVerified(address _soul) external view returns (bool) {
        if (keccak256(bytes(souls[_soul].identity)) == zeroHash2) {
            return false;
        } else {
            return true;
        }
    }

    function getSoul(address _soul) external view returns (Soul memory) {
        return souls[_soul];
    }

    /**
     * Profiles are used by 3rd parties and individual users to store data.
     * Data is stored in a nested mapping relative to msg.sender
     * By default they can only store data on addresses that have been minted
     */
    function setProfile(address _soul, Soul memory _soulData) external {
        require(
            keccak256(abi.encode(souls[_soul].created)) != zeroHash,
            "Cannot create a profile for a soul that has not been minted"
        );
        soulProfiles[msg.sender][_soul] = _soulData;
        profiles[_soul].push(msg.sender);
        emit SetProfile(msg.sender, _soul);
    }

    function getProfile(address _profiler, address _soul)
        external
        view
        returns (Soul memory)
    {
        return soulProfiles[_profiler][_soul];
    }

    function listProfiles(address _soul)
        external
        view
        returns (address[] memory)
    {
        return profiles[_soul];
    }

    function hasProfile(address _profiler, address _soul)
        public
        view
        returns (bool)
    {
        if (
            keccak256(abi.encode(soulProfiles[_profiler][_soul].created)) ==
            zeroHash
        ) {
            return false;
        } else {
            return true;
        }
    }

    function removeProfile(address _profiler, address _soul) external {
        require(
            keccak256(abi.encode(souls[_soul].created)) != zeroHash,
            "Cannot remove a profile for a soul that has not been minted"
        );
        require(
            msg.sender == _soul,
            "Only users have rights to delete their profile data"
        );
        require(hasProfile(_profiler, _soul), "Profile does not exist");
        delete soulProfiles[_profiler][msg.sender];
        emit RemoveProfile(_profiler, _soul);
    }
}
