pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


/// @title SpaceshipToken
contract SpaceshipToken is ERC721Token("CryptoSpaceships", "CST"), Ownable {

    // Struct with spaceship attributes
    struct Spaceship {
        bytes metadataHash; // IPFS Hash 
        uint8 energy;
        uint8 lasers;
        uint8 shield;
    }

    // All the spaceships minted
    Spaceship[] public spaceships;


    mapping(uint => uint) public spaceshipPrices;
    uint[] public shipsForSale;
    mapping(uint => uint) public indexes; // shipId => shipForSale

    /// @notice Mint a token
    /// @param _metadataHash IPFS hash with the token metadata
    /// @param _energy Attribute: Energy
    /// @param _lasers Attribute: Lasers
    /// @param _price Sale price in Wei
    function mint(bytes _metadataHash,
                  uint8 _energy, 
                  uint8 _lasers, 
                  uint8 _shield, 
                  uint _price)
                  public 
                  onlyOwner {

        Spaceship memory s = Spaceship({
            metadataHash: _metadataHash,
            energy: _energy,
            lasers: _lasers,
            shield: _shield
        });

        uint spaceshipId = spaceships.push(s) - 1;

        spaceshipPrices[spaceshipId] = _price;

        shipsForSale.push(spaceshipId);
        indexes[spaceshipId] = shipsForSale.length - 1;

        // _mint is a function part of ERC721Token that generates the NFT
        // The contract will own the newly minted tokens
        _mint(address(this), spaceshipId);
    }

    /// @notice Get number of spaceships for sale
    function shipsForSaleN() public view returns(uint) {
        return shipsForSale.length;
    }

    /// @notice Buy spaceship
    /// @param _spaceshipId TokenId
    function buySpaceship(uint _spaceshipId) public payable {
        // You can only buy the spaceships owned by this contract
        require(ownerOf(_spaceshipId) == address(this));

        // Value sent should be at least the spaceship price
        require(msg.value >= spaceshipPrices[_spaceshipId]);

        // We approve the transfer directly to avoid creating two trx
        // then we send the token to the sender
        tokenApprovals[_spaceshipId] = msg.sender;
        safeTransferFrom(address(this), msg.sender, _spaceshipId);

        // Delete the token from the list of tokens for sale
        uint256 replacer = shipsForSale[shipsForSale.length - 1];
        uint256 pos = indexes[_spaceshipId];
        shipsForSale[pos] = replacer;
        indexes[replacer] = pos;
        shipsForSale.length--;
        
        uint refund = msg.value - spaceshipPrices[_spaceshipId];
        if (refund > 0)
            msg.sender.transfer(refund);
    }

    /// @notice Withdraw sales balance
    function withdrawBalance() public onlyOwner {
        owner.transfer(address(this).balance);
    }

    /// @notice Get Metadata URI
    /// @param _spaceshipId TokenID
    /// @return IPFS URL of the metadata
    function tokenURI(uint256 _spaceshipId) public view returns (string) {
        Spaceship storage s = spaceships[_spaceshipId];
        return strConcat("https://ipfs.io/ipfs/", string(s.metadataHash));
    }

    /// @notice Concatenate strings
    /// @param _a First string
    /// @param _b Second string
    /// @return _a+_b
    function strConcat(string _a, string _b) private returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);
        uint k = 0;

        for (uint i = 0; i < _ba.length; i++) 
            bab[k++] = _ba[i];

        for (i = 0; i < _bb.length; i++) 
            bab[k++] = _bb[i];

        return string(bab);
    }

}