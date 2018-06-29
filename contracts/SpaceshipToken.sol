pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 @title Contrato base para Mexico Workshop
 @dev En Status tambien hablamos espanol ;)
 */
contract SpaceshipToken is ERC721Token("SpaceshipToken", "SST"), Ownable {

    /// @dev Estructura que representa nuestra nave spacial
    enum ShipCategory {NONE, FIGHTER, FRIGATE, BATTLESHIP}

    struct Vector {
        uint256 x;
        uint256 y;
    }

    struct Spaceship {
        bytes32 metadataHash; // IPFS Hash 
        ShipCategory category;
        uint8 HP;
        uint8 attack;
        uint8 defense;
        uint8 speed;
        uint8 experience;
        uint8 level;
        uint attackCooldown;
        Vector position;
    }

    // Todas las naves que se han creado.
    Spaceship[] public spaceships;

    // Precio de las naves
    mapping(uint => uint) spaceshipPrices;

    function mint(bytes32 _metadataHash,
                  ShipCategory _category, 
                  uint8 _HP, 
                  uint8 _attack, 
                  uint8 _defense, 
                  uint8 _speed,
                  uint attackCooldown,
                  uint _price)
                  public 
                  onlyOwner {

        Vector memory p = Vector(0, 0);
        Spaceship memory s = Spaceship({
            metadataHash: _metadataHash,
            HP: _HP,
            attack: _attack,
            defense: _defense,
            speed: _speed,
            category: _category,
            experience: 0,
            level: 0,
            attackCooldown: 0,
            position: p
        });

        uint spaceshipId = spaceships.push(s) - 1;

        spaceshipPrices[spaceshipId] = _price;

        // _mint es una funcion del contrato ERC721Token que genera el NFT
        // El contrato sera dueno de las naves que se generen
        _mint(address(this), spaceshipId);
    }

    function buySpaceship(uint _spaceshipId) payable {
        // Se debe enviar al menos el precio de la nave
        require(msg.value >= spaceshipPrices[_spaceshipId]);

        // Solo se pueden comprar las naves cuyo dueno sea el contrato
        require(ownerOf(_spaceshipId) == address(this));

        safeTransferFrom(address(this), msg.sender, _spaceshipId);
                
        uint refund = msg.value - spaceshipPrices[_spaceshipId];
        if(refund > 0)
            msg.sender.transfer(refund);
    }

    function withdrawBalance() external onlyOwner {
        owner.transfer(this.balance);
    }

}