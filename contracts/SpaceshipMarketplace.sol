pragma solidity 0.4.24;

import "./SpaceshipToken.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";


contract SpaceshipMarketplace is ERC721Holder {

    // Esta estructura guarda informacion sobre las ventas
    struct Sale {
        uint spaceshipId;
        uint price;
        address owner;
    }

    SpaceshipToken token;

    Sale[] public sales;

    mapping(uint => uint) spaceshipToSale;

    event NewSale(uint indexed spaceshipId, uint price, uint saleId);
    event ShipSold(uint indexed spaceshipId, uint price, address indexed oldOwner, address indexed newOwner);


    constructor(SpaceshipToken _token) public {
        token = _token;
    }

    function buy(uint _saleId) payable {
        Sale storage s = sales[_saleId];

        // TODO: descomentar esto para evitar que el dueno compre su propia nave
        // require(s.owner != msg.sender);
        require(msg.value >= s.price);
        
        uint refund = msg.value - s.price;
        if(refund > 0)
            msg.sender.transfer(refund);

        // Transferimos el ether de la venta
        s.owner.transfer(s.price);

        emit ShipSold(s.spaceshipId, s.price, s.owner, msg.sender);

        // Transferimos el token
        token.approve(msg.sender, s.spaceshipId);
        token.safeTransferFrom(address(this), msg.sender, s.spaceshipId);

        // Eliminamos la venta // TODO: reorder
        delete spaceshipToSale[s.spaceshipId];

        Sale replacer = sales[sales.length - 1];
        sales[_saleId] = replacer;
        sales.length--;
    }

    function forSale(uint _spaceshipId, uint _price){
        // Solo se pueden vender tus propias naves
        require(token.ownerOf(_spaceshipId) == msg.sender);

        // Transferimos el token a este contrato escrow
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
