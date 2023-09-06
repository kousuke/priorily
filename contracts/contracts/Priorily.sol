// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Uncomment this line to use console.log
//import "hardhat/console.sol";

contract Priorily is ReentrancyGuard{
  address public treasury;

  event PlanCreated (uint planId, PlanStatus status);
  event PlanMoved(uint planId, PlanStatus status);
  event PlanHasNewVote(uint planId);

  enum PlanStatus{planned, inProgress, backlog, done, suggested}

  struct Plan {
    uint planId;
    string title;
    uint planType;
    PlanStatus status;
    address[] voters;
    address owner;
  }
  uint public planIdCounter;
  mapping(uint => Plan) public plans;

  address public superOwner;
  address[] public owners;

  // 1,000,000,000,000,000,000 = 1 eth
  uint256 amountToCreatePlan =  1000000000000000 wei;
  uint256 amountToVote = 100000000000 wei;

  constructor(address _treasury) {
    owners = new address[](0);
    owners.push(msg.sender);
    superOwner = msg.sender;
    treasury = _treasury;
  }
  modifier requireOwner() {
      bool _isOwner = false;
    if(superOwner == msg.sender) _isOwner = true;
    for(uint i=0; i<owners.length; i++){
      if(owners[i] == msg.sender){
        _isOwner = true;
        break;
      }
    }
    if(!_isOwner)
      revert("need in owners");
    _;
  }

  bool internal noReentrantLock;

  function setTreasury(address addr) external nonReentrant {
    require(treasury == msg.sender, "not from tresury address");
    treasury = addr;
  }

  function addOwner(address addr) external requireOwner{
    owners.push(addr);
  }

  function removeOwner(address addr) external requireOwner{
    owners.push(addr);
  }

  function isTreasury(address addr) external view returns(bool){
    return addr == treasury;
  }

  function isSuperOwner(address addr) external view returns(bool){
    return addr == superOwner;
  }

  function isOwner(address addr) external view returns(bool){
    for(uint i=0; i<owners.length; i++){
      if(owners[i] == addr) {
        return true;
      }
    }
    return false;
  }

  function savePlan(uint planId, string memory title, uint planType) payable external requireOwner nonReentrant returns(Plan memory){
    plans[planId].title = title;
    plans[planId].planType = planType;
    return plans[planId];
  }

  function createPlan(string memory title, uint planType) payable external requireOwner nonReentrant returns(uint){
    require(msg.value >= amountToCreatePlan, "need wei");
    (bool s, ) = payable(treasury).call{value: msg.value}("");
    require(s);
    return makePlan(title, planType, PlanStatus.planned);
  }

  function suggestPlan(string memory title, uint planType) payable external nonReentrant returns(uint){
    require(msg.value >= amountToVote, "need wei");
    (bool s, ) = payable(treasury).call{value: msg.value}("");
    require(s);
    return makePlan(title, planType, PlanStatus.suggested);
  }

  function makePlan(string memory title, uint planType, PlanStatus staus) internal returns(uint) {
    uint planId = planIdCounter;
    planIdCounter += 1;
    plans[planId] = Plan(planId, title, planType, staus,new address[](0), msg.sender);
    emit PlanCreated(planId, PlanStatus.suggested);
    return planId;
  }

  function changePlanStatus(uint planId, PlanStatus status) external requireOwner{
    plans[planId].status = status;
    emit PlanMoved(planId, status);
  }
  function changePlanText(uint planId, string memory title) external requireOwner{
    plans[planId].title = title;
  }

  function getPlan(uint planId) external view returns(Plan memory) {
    return plans[planId];
  }

  function getPlans() external view returns(Plan[] memory) {
    if(planIdCounter == 0)
      return new Plan[](0);
    Plan[] memory result = new Plan[](planIdCounter);
    for(uint i = 0; i< planIdCounter; i++){
      result[i] = plans[i];
    }
    return result;
  }

  function vote(uint planId) payable external nonReentrant {
    require(msg.value >= amountToVote, "");

    for(uint i=0; i<plans[planId].voters.length; i++){
      if(plans[planId].voters[i] == msg.sender)
        revert("already voted");
    }
    plans[planId].voters.push(msg.sender);
    emit PlanHasNewVote(planId);
  }


  fallback() external {
  }
}
