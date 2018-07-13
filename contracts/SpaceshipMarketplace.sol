pragma solidity 0.4.24;

import "./SpaceshipToken.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";


/// @title Escrow contract
contract SpaceshipMarketplace is ERC721Holder {

    struct Sale {
        uint spaceshipId;
        uint price;
        address owner;
    }

    SpaceshipToken public token;

    Sale[] public sales;

    mapping(uint => uint) public spaceshipToSale;

    event NewSale(uint indexed spaceshipId, uint price, uint saleId);
    
    event ShipSold(uint indexed spaceshipId, uint price, address indexed oldOwner, address indexed newOwner);

    /// @notice Constructor
    /// @param _token Spaceship token address
    constructor(address _token) public {
        token = SpaceshipToken(_token);
    }

    /// @notice Buy token
    /// @param _saleId Index of sales[]
    function buy(uint _saleId) public payable {
        Sale storage s = sales[_saleId];

        // TODO: uncomment this to avoid the owner buying his own tokens
        // require(s.owner != msg.sender);
        require(msg.value >= s.price);
        
        uint refund = msg.value - s.price;
        if(refund > 0)
            msg.sender.transfer(refund);

        s.owner.transfer(s.price);

        emit ShipSold(s.spaceshipId, s.price, s.owner, msg.sender);

        // Transfer the token
        token.approve(msg.sender, s.spaceshipId);
        token.safeTransferFrom(address(this), msg.sender, s.spaceshipId);

        // Delete sale
        delete spaceshipToSale[s.spaceshipId];
        Sale replacer = sales[sales.length - 1];
        sales[_saleId] = replacer;
        sales.length--;
    }

    /// @notice Set token for sale
    /// @param _spaceshipId Token Id
    /// @param _price Sale price
    function forSale(uint _spaceshipId, uint _price){
        // You can only sell your own ships
        require(token.ownerOf(_spaceshipId) == msg.sender);

        token.safeTransferFrom(msg.sender, address(this), _spaceshipId);

        Sale memory s = Sale({
            spaceshipId: _spaceshipId,
            price: _price,
            owner: msg.sender
        });

        uint saleId = sales.push(s) - 1;

        spaceshipToSale[_spaceshipId] = saleId;

        emit NewSale(_spaceshipId, _price, saleId);
    }

    /// @notice Remove listing
    /// @param _spaceshipId Spaceship Id
    function withdraw(uint _spaceshipId){
        require(sales[spaceshipToSale[_spaceshipId]].owner == msg.sender);

        delete sales[spaceshipToSale[_spaceshipId]];
        delete spaceshipToSale[_spaceshipId];

        token.safeTransferFrom(address(this), msg.sender, _spaceshipId);
    }

    /// @notice Ships for sale quantity
    function nSale() public view returns(uint) {
        return sales.length;
    }

}
