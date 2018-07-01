pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


/**
 @title Contrato base para Mexico Workshop
 @dev En Status tambien hablamos espanol ;)
 */
contract SpaceshipToken is ERC721Token("CryptoSpaceships", "CST"), Ownable {

    /// @dev Estructura que representa nuestra nave spacial
    struct Spaceship {
        bytes metadataHash; // IPFS Hash 
        uint8 energy;
        uint8 lasers;
        uint8 shield;
    }

    // Todas las naves que se han creado.
    Spaceship[] public spaceships;

    event LevelUp(uint spaceshipId, uint level);

    // Precio de las naves
    mapping(uint => uint) public spaceshipPrices;
    uint[] public shipsForSale;
    mapping(uint => uint) indexes; // shipId => shipForSale

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

        // _mint es una funcion del contrato ERC721Token que genera el NFT
        // El contrato sera dueno de las naves que se generen
        _mint(address(this), spaceshipId);
    }

    function shipsForSaleN() public view returns(uint){
        return shipsForSale.length;
    }

    function buySpaceship(uint _spaceshipId) public payable {
        // Solo se pueden comprar las naves cuyo dueno sea el contrato
        require(ownerOf(_spaceshipId) == address(this));

        // Se debe enviar al menos el precio de la nave
        require(msg.value != 0);

        // Transferimos la 
        // Approbamos directamente para evitar tener que crear una transaccion extra
        tokenApprovals[_spaceshipId] = msg.sender;
        safeTransferFrom(address(this), msg.sender, _spaceshipId);

        // La eliminamos de la lista para venta
        uint256 replacer = shipsForSale[shipsForSale.length - 1];
        uint256 pos = indexes[_spaceshipId];
        shipsForSale[pos] = replacer;
        indexes[replacer] = pos;
        shipsForSale.length--;
                
        uint refund = msg.value - spaceshipPrices[_spaceshipId];
        if(refund > 0)
            msg.sender.transfer(refund);
    }

    function withdrawBalance() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    function getAttributes(uint _spaceshipId) public view returns (
        uint8 energy,
        uint8 lasers,
        uint8 shield
    ){
        Spaceship storage s = spaceships[_spaceshipId];
        
        energy = s.energy;
        lasers = s.lasers;
        shield = s.shield;
    }
}