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

    struct Spaceship {
        bytes32 metadataHash; // IPFS Hash 
        ShipCategory category;
        uint8 HP;
        uint8 attack;
        uint8 defense;
        uint8 speed;
    }

    // Todas las naves que se han creado.
    Spaceship[] public spaceships;

    function mint(bytes32 _metadataHash,
                  ShipCategory _category, 
                  uint8 _HP, 
                  uint8 _attack, 
                  uint8 _defense, 
                  uint8 _speed)
                  public 
                  onlyOwner {

        Spaceship memory s = Spaceship({
            metadataHash: _metadataHash,
            HP: _HP,
            attack: _attack,
            defense: _defense,
            speed: _speed,
            category: _category
        });

        uint spaceshipId = spaceships.push(s) - 1;

        // _mint es una funcion del contrato ERC721Token que genera el NFT
        _mint(msg.sender, spaceshipId);
    }

    
}
