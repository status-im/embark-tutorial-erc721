pragma solidity 0.4.24;

import "./SpaceshipToken.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";


/// @title Escrow para compra venta del token
contract SpaceshipMarketplace is ERC721Holder {

    // Esta estructura guarda informacion sobre las ventas
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
    /// @param _token Direccion del token
    constructor(address _token) public {
        token = SpaceshipToken(_token);
    }

    /// @notice Comprar token
    /// @param _saleId Id de la venta que se desea
    function buy(uint _saleId) public payable {
        Sale storage s = sales[_saleId];

        // TODO: descomentar esto para evitar que el dueno compre su propia nave
        // require(s.owner != msg.sender);
        require(msg.value >= s.price);
        
        // Devolvemos el sobrante
        uint refund = msg.value - s.price;
        if(refund > 0)
            msg.sender.transfer(refund);

        // Transferimos el ether de la venta
        s.owner.transfer(s.price);

        emit ShipSold(s.spaceshipId, s.price, s.owner, msg.sender);

        // Transferimos el token
        token.approve(msg.sender, s.spaceshipId);
        token.safeTransferFrom(address(this), msg.sender, s.spaceshipId);

        // Eliminamos la venta
        delete spaceshipToSale[s.spaceshipId];
        Sale replacer = sales[sales.length - 1];
        sales[_saleId] = replacer;
        sales.length--;
    }

    /// @notice Publicar token para venta
    /// @param _spaceshipId Id del token
    /// @param _price Precio de venta
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

        // Agregamos el token a la lista de vtokens en venta
        uint saleId = sales.push(s) - 1;

        spaceshipToSale[_spaceshipId] = saleId;

        emit NewSale(_spaceshipId, _price, saleId);
    }

    /// @notice Retirar token de listado de venta
    /// @param _spaceshipId Id del token
    function withdraw(uint _spaceshipId){
        require(sales[spaceshipToSale[_spaceshipId]].owner == msg.sender);

        // Eliminamos el registro de venta
        delete sales[spaceshipToSale[_spaceshipId]];
        delete spaceshipToSale[_spaceshipId];

        // Transferimos nuestro token
        token.safeTransferFrom(address(this), msg.sender, _spaceshipId);
    }

    /// @notice Cantidad de tokens a la venta
    function nSale() public view returns(uint) {
        return sales.length;
    }

}
