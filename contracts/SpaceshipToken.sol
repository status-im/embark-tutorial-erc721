pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 @title Contrato base para Mexico Workshop
 @dev En Status tambien hablamos espanol ;)
 */
contract SpaceshipToken is ERC721Token("SpaceshipToken", "SST"), Ownable {

    /// @dev Estructura que representa nuestra nave spacial
    struct Spaceship {
        bytes32 metadataHash; // IPFS Hash 
        uint HP;
        uint8 attack;
        uint8 defense;
        uint8 speed;
        uint cooldown;
        uint8 level;
        uint experience;
    }

    // Todas las naves que se han creado.
    Spaceship[] public spaceships;

    // Precio de las naves
    mapping(uint => uint) spaceshipPrices;

    function mint(bytes32 _metadataHash,
                  uint8 _HP, 
                  uint8 _attack, 
                  uint8 _defense, 
                  uint8 _speed,
                  uint _cooldown,
                  uint _price)
                  public 
                  onlyOwner {

        Spaceship memory s = Spaceship({
            metadataHash: _metadataHash,
            HP: _HP,
            attack: _attack,
            defense: _defense,
            speed: _speed,
            experience: 0,
            level: 1,
            cooldown: _cooldown
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
        owner.transfer(address(this).balance);
    }

    address public spaceBattle;

    function setSpaceBattleAddress(address _spaceBattle) onlyOwner {
        spaceBattle = _spaceBattle;
    }

    modifier onlySpaceBattle(){
        require(msg.sender == spaceBattle);
        _;
    }

    function updateShipHP(uint _shipId, uint _HP) onlySpaceBattle {
        require(ownerOf(_shipId) != address(0));

        Spaceship storage s = spaceships[_shipId];

        if(_HP == 0){
            // Destroy token
            _burn(msg.sender,  _shipId);
        } else {
            s.HP = _HP;
        }
    }

    function gainExperience(uint _shipId, uint _experience) onlySpaceBattle {
        require(ownerOf(_shipId) != address(0));

        Spaceship storage s = spaceships[_shipId];

        uint currentExperience = s.experience;
        if(currentExperience + _experience > s.level * 100){
            s.level++;
            s.experience = 0;
        } else {
            s.experience += _experience;
        }
    }

    function getAttributes(uint _shipId) public view returns (
        uint HP,
        uint8 attack,
        uint8 defense,
        uint8 speed,
        uint experience,
        uint8 level,
        uint cooldown
    ){
        Spaceship storage s = spaceships[_shipId];
        
        HP = s.HP;
        attack = s.attack;
        defense = s.defense;
        speed = s.speed;
        experience = s.experience;
        level = s.level;
        cooldown = s.cooldown;
    }
}