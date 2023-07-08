// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstate is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // https://rinkeby.etherscan.io/token/0x47d3d1e853ae4675c6d93e4b559572c2c0752125
    // https://testnets.opensea.io/collection/real-estate-wmlf80cnw9
    constructor() ERC721("Real Estate", "REAL") {
        mint(
            "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
        );
    }

    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        //MINT FUNCTION IS ASSIGNING THE OWNERSHIP OF THE ITEM TO THE CALLERS ADDRESS
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
