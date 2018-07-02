pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


/// @title Contrato base para Mexico Workshop
/// @dev En Status tambien hablamos espanol ;)
contract SpaceshipToken is ERC721Token("CryptoSpaceships", "CST"), Ownable {

    // Estructura que representa nuestra nave spacial
    struct Spaceship {
        bytes metadataHash; // IPFS Hash 
        uint8 energy;
        uint8 lasers;
        uint8 shield;
    }

    // Todas las naves que se han creado.
    Spaceship[] public spaceships;

    // Precio de las naves
    mapping(uint => uint) public spaceshipPrices;
    uint[] public shipsForSale;
    mapping(uint => uint) public indexes; // shipId => shipForSale

    /// @notice Crear un tocken
    /// @param _metadataHash IPFS hash que contiene la metadata del token
    /// @param _energy Atributo: Energia
    /// @param _lasers Atributo: Lasers
    /// @param _price Precio de venta del token
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

    /// @notice Obtener cantidad de naves a la venta
    /// @return Cantidad
    function shipsForSaleN() public view returns(uint) {
        return shipsForSale.length;
    }

    /// @notice Comprar nave
    /// @param _spaceshipId Id del token a comprar
    function buySpaceship(uint _spaceshipId) public payable {
        // Solo se pueden comprar las naves cuyo dueno sea el contrato
        require(ownerOf(_spaceshipId) == address(this));

        // Se debe enviar al menos el precio de la nave
        require(msg.value != 0);

        // Approvamos directamente para evitar tener que crear una transaccion extra
        // y luego enviamos la nave a quien origino la transaccion
        tokenApprovals[_spaceshipId] = msg.sender;
        safeTransferFrom(address(this), msg.sender, _spaceshipId);

        // La eliminamos de la lista para venta
        // Esto se ve un poco mas complicado de lo necesario, 
        // Pero es para borrar elementos del arreglo de forma eficiente
        uint256 replacer = shipsForSale[shipsForSale.length - 1];
        uint256 pos = indexes[_spaceshipId];
        shipsForSale[pos] = replacer;
        indexes[replacer] = pos;
        shipsForSale.length--;
        
        // Reembolsamos el sobrante
        uint refund = msg.value - spaceshipPrices[_spaceshipId];
        if (refund > 0)
            msg.sender.transfer(refund);
    }

    /// @notice Retirar balance por compras hechas
    function withdrawBalance() public onlyOwner {
        owner.transfer(address(this).balance);
    }

    /// @notice Obtener metadata
    /// @param _spaceshipId Id del token
    /// @return Direccion desde donde obtener la metadata
    function tokenURI(uint256 _spaceshipId) public view returns (string) {
        Spaceship storage s = spaceships[_spaceshipId];
        return strConcat("https://ipfs.io/ipfs/", string(s.metadataHash));
    }

    /// @notice Concatenar strings
    /// @dev La concatenacion por strings por ahora debe hacerse manual o usando librerias
    /// @param _a Primer string
    /// @param _b Segundo string
    /// @return String concatenado
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