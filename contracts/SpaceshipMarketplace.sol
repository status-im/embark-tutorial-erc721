pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract SpaceshipMarketPlace {

    struct Sale {
        uint spaceshipId;
        uint price;
        address owner;
    }

    ERC721Token token;

    Sale[] public sales;
    mapping(uint => uint) spaceshipToSale;

    event NewSale(uint indexed spaceshipId, uint price, uint saleId);

    constructor(ERC721Token _token) public{
        token = _token;
    }

    function buy(uint _saleId) payable {
        require(sales[_saleId].owner == msg.sender);
        require(msg.value >= sales[_saleId].price);

        uint price = sales[_saleId].price;
        
        uint refund = msg.value - price;
        if(refund > 0)
            msg.sender.transfer(refund);

        // Transferimos el ether de la venta
        sales[_saleId].owner.transfer(price);

        // Transferimos el token
        token.safeTransferFrom(address(this), msg.sender, sales[_saleId].spaceshipId);

        // Eliminamos la venta
        delete spaceshipToSale[sales[_saleId].spaceshipId];
        delete sales[_saleId];
    }

    function forSale(uint _spaceshipId, uint _price){
        // Solo se pueden vender tus propias naves
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

    function withdraw(uint _spaceshipId){
        require(sales[spaceshipToSale[_spaceshipId]].owner == msg.sender);

        // Eliminamos el registro de venta
        delete sales[spaceshipToSale[_spaceshipId]];
        delete spaceshipToSale[_spaceshipId];

        // Transferimos nuestro token
        token.safeTransferFrom(address(this), msg.sender, _spaceshipId);
    }

    function nSale() public view returns(uint) {
        return sales.length;
    }

}
