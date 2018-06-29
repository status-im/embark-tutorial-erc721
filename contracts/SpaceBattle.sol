pragma solidity 0.4.24;

contract SpaceBattle {

    mapping(uint => mapping(uint => uint)) shipPositions;

    function move(uint _myShipId, uint _x, uint _y){
        
    }

    function attack(uint _myShipId, uint _shipId){

    }

    function repair(uint _myShipId) payable {

    }

    function canMove(uint _myShipId, uint _x, uint _y) public view returns(bool) {

    }

    function canAttack(uint _myShipId, uint _shipId) public view returns(bool) {

    }

    function repairCost(uint _myShipId) public view returns(uint) {

    }

}