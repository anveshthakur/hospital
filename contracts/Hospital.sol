// SPDX-License-Identifier: DIT
pragma solidity ^0.6.0;

contract Hospital{
    uint patientCount = 0;
    address owner;
    enum Gender{Male, Female, Others, NotSpecified}
    Gender constant defaultChoice = Gender.NotSpecified;
    
    struct patient{
        uint patientId;
        string patientName;
        string phoneNumber;
        string email;
        Gender gender;
        uint age;
        string symptoms; //cost cutting
        bool paid; //
        bool status;
    }
    
    mapping(address => patient) public patients;
    
    constructor() public{
        owner = msg.sender;
    }

    function totalPatient() view public returns(uint){
        return patientCount;
    }
    
    function registerUser(address _patientAddress, string memory _patientName, string memory _phoneNumber, string memory _email, uint _gender, uint _age, string memory _symptoms) public{
        require(msg.sender == owner || msg.sender == _patientAddress, "You're not Authorized");
        require(patients[_patientAddress].paid == true, "You have to pay first");
        patients[_patientAddress].patientName = _patientName;
        patients[_patientAddress].phoneNumber = _phoneNumber;
        patients[_patientAddress].age = _age;
        patients[_patientAddress].symptoms = _symptoms;
        patients[_patientAddress].email = _email;
        if(_gender == 1){
            patients[_patientAddress].gender = Gender.Male;
        }
        else if(_gender == 2){
            patients[_patientAddress].gender = Gender.Female;
        }
        else if(_gender == 3){
            patients[_patientAddress].gender = Gender.Others;
        }
    }
    
    function isOwner() view public returns(bool){
        return msg.sender == owner;
    }
    
    function totalBalance() public view returns(uint256){
        return address(this).balance;
    }
    
    function withdraw(address payable _to) public{
        require(msg.sender == owner, "You're Not Authorized");
        _to.transfer(totalBalance());
    }

    receive() external payable{
        require(msg.value == 1 ether, "Patient Registration Requires to be 1 ether exact");
        patientCount++; 
        patients[msg.sender].paid = true;
        patients[msg.sender].patientId = patientCount;
        patients[msg.sender].gender = defaultChoice;
        patients[msg.sender].status = false;
    }
}




// abi
// app.js -----> SmartContact ------> Blockchain