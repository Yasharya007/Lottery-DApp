// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

contract Lottery{
    address public manager;
    address payable[] public participants;

    constructor(){
        manager=msg.sender;
    }
    receive() external payable{
        participants.push(payable(msg.sender));
    }
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
    function random() public view returns(uint){

       return uint(keccak256(abi.encodePacked(block.prevrandao,block.timestamp,participants.length)));
    }
    function selectWinner() public{
        require(msg.sender == manager, "Only manager can call this");
        require(participants.length >= 3, "At least 3 participants required");
        uint r=random();
        uint index=r%participants.length;
        address payable winner=participants[index];
        winner.transfer(getBalance());
    }

}

