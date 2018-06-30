pragma solidity 0.4.24;

import "./SpaceshipToken.sol";


contract SpaceBattle {

    struct ShipState {
        uint x;
        uint y;
        int health;
        address owner;
        uint lastActionBlock;
    }

    //        X              Y      shipId
    mapping(uint => mapping(uint => uint)) gameGrid;
    mapping(uint => ShipState) shipState;

    SpaceshipToken token;

    event ShipJoinedBattle(uint indexed shipId, uint x, uint y);
    event ShipLeftBattle(uint indexed shipId);
    event ShipRepaired(uint indexed shipId, int health);
    event ShipDestroyed(uint indexed shipId, uint indexed destroyedBy);
    event ShipAttacked(uint indexed shipId, uint indexed attackedBy, int health);

    constructor(SpaceshipToken _token) public{
        token = _token;
    }

    function enterGame(uint _myShipId, uint _x, uint _y){
        require(token.ownerOf(_myShipId) == msg.sender);
        require(canMove(_myShipId, _x, _y));
        token.safeTransferFrom(msg.sender, address(this), _myShipId);

        gameGrid[_x][_y] = _myShipId;

        int HP;
        (HP,,,,,,) = token.getAttributes(_myShipId);

        shipState[_myShipId].owner = msg.sender;
        shipState[_myShipId].x = _x;
        shipState[_myShipId].y = _y;
        shipState[_myShipId].health = HP;

        emit ShipJoinedBattle(_myShipId, _x, _y);
    }

    modifier requiresCooldown(uint _myShipId){
        uint cooldown;
        (,,,,,, cooldown) = token.getAttributes(_myShipId);
        ShipState storage state = shipState[_myShipId];
        require(state.lastActionBlock + cooldown < block.number);
        
        _;

        state.lastActionBlock = block.number;
    }

    function hasEnemy(uint _x, uint _y) private returns(bool){
        ShipState memory s = shipState[gameGrid[_x][_y]];
        return  s.owner != msg.sender &&
                s.owner != address(0);
    }

    function leaveGame(uint _myShipId) public requiresCooldown(_myShipId) {
        require(shipState[_myShipId].owner == msg.sender);

        ShipState memory state = shipState[_myShipId];

        // No debe haber enemigos al lado
        require(!hasEnemy(state.x, state.y + 1) && 
                !hasEnemy(state.x, state.y - 1) &&
                !hasEnemy(state.x + 1, state.y) &&
                !hasEnemy(state.x - 1, state.y));

        delete gameGrid[state.x][state.y];
        delete shipState[_myShipId];

        token.safeTransferFrom(address(this), msg.sender, _myShipId);

        emit ShipLeftBattle(_myShipId);
    }

    function move(uint _myShipId, uint _x, uint _y) public requiresCooldown(_myShipId) {
        require(shipState[_myShipId].owner == msg.sender);
        require(canMove(_myShipId, _x, _y));

        ShipState storage state = shipState[_myShipId];

        delete gameGrid[state.x][state.y];
        gameGrid[_x][_y] = _myShipId;

        state.x = _x;
        state.y = _y;
    }

    function attack(uint _myShipId, uint _enemyShipId) public requiresCooldown(_myShipId) {
        ShipState storage myState = shipState[_myShipId];
        ShipState storage enemyState = shipState[_enemyShipId];

        require(myState.owner == msg.sender);
        require(canAttack(_myShipId, _enemyShipId));

        int myHP;
        uint myAttack;
        uint enemyAttack;
        uint enemyDefense;
        uint myLevel;
        uint enemyLevel;

        (myHP,myAttack,,,,myLevel,) = token.getAttributes(_myShipId);
        (,enemyAttack,enemyDefense,,,enemyLevel,) = token.getAttributes(_enemyShipId);

        int attackPower = int(myLevel * myAttack - enemyLevel * enemyLevel);
        if(attackPower < 0)
            attackPower = 0;
        
        enemyState.health -= attackPower;

        if(enemyState.health < 0){
            // Reparamos la mitad del dano de la nave
            myState.health += (myHP - myState.health) / 2;
            if(token.gainExperience(_myShipId, enemyLevel * enemyAttack * enemyDefense)){
                (myHP,,,,,,) = token.getAttributes(_myShipId);
                myState.health = myHP;
            }

            // Destruir enemigo
            token.destroyShip(_enemyShipId);
            delete gameGrid[enemyState.x][enemyState.y];
            delete shipState[_enemyShipId];

            emit ShipDestroyed(_enemyShipId, _myShipId);
        } else {
            emit ShipAttacked(_enemyShipId, _myShipId, enemyState.health);
        }
    }

    function repair(uint _myShipId) payable requiresCooldown(_myShipId) {
        uint cost = uint(repairCost(_myShipId));
        ShipState storage myState = shipState[_myShipId];

        require(msg.value >= cost);
        require(myState.owner == msg.sender);

        int HP;
        (HP,,,,,,) = token.getAttributes(_myShipId);

        myState.health = HP;

        emit ShipRepaired(_myShipId, HP);

        uint refund = msg.value - cost;
        if(refund > 0)
            msg.sender.transfer(refund);
    }

    function canMove(uint _myShipId, uint _x, uint _y) public view returns(bool) {
        ShipState storage myState = shipState[_myShipId];

        // Tiene que moverse a algun sitio
        if(myState.x == _x && myState.y == _y)
            return false;

        // Solo se puede mover horizontal o vertical
        if(myState.x != _x && myState.y != _y)
            return false;
        
        if(myState.owner != msg.sender) return false;

        uint cooldown;
        uint speed;
        (,,,speed,,, cooldown) = token.getAttributes(_myShipId);
        if(myState.lastActionBlock + cooldown > block.number)
            return false;

        // Verificamos que podamos llegar a la posicion
        require((_x >= myState.x - speed && _x <= myState.x + speed) ||
                (_y >= myState.y - speed && _y <= myState.y + speed));

        uint startX = myState.x > _x ? _x : myState.x;
        uint endX =   myState.x > _x ? myState.x : _x;
        uint startY = myState.y > _y ? _y : myState.y;
        uint endY =   myState.y > _y ? myState.y : _y;

        // Verificamos si la posicion esta ocupada
        for(uint i = startX; i <= endX; i++){
            for(uint j = startY; j <= endY; j++){
                uint currShip = gameGrid[i][j];
                if(shipState[currShip].owner != address(0)){
                    return false;
                }
            }
        }

        return true;
    }

    function canAttack(uint _myShipId, uint _enemyShipId) public view returns(bool) {
        ShipState storage myState = shipState[_myShipId];
        ShipState storage enemyState = shipState[_enemyShipId];

        if(myState.owner != msg.sender) return false;

        uint cooldown;
        (,,,,,, cooldown) = token.getAttributes(_myShipId);
        if(myState.lastActionBlock + cooldown > block.number)
            return false;

        if(myState.owner == address(0) || enemyState.owner == address(0))
            return false;

        return (myState.x + 1 == enemyState.x && myState.y == enemyState.y) ||
               (myState.x - 1 == enemyState.x && myState.y == enemyState.y) ||
               (myState.x == enemyState.x && myState.y + 1 == enemyState.y) ||
               (myState.x == enemyState.x && myState.y - 1 == enemyState.y);
    }

    function repairCost(uint _myShipId) public view returns(int) {
        ShipState memory state = shipState[_myShipId];

        int HP;
        (HP,,,,,,) = token.getAttributes(_myShipId);

        int missingHealth = HP - state.health;

        return missingHealth * 2000; // TODO: tune this
    }

}