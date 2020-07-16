pragma solidity >=0.4.2 <0.7.0;
contract Election
{
    struct Candidate{
        uint id;
        string name;
        uint votes;
    }
     enum Role {
        VOTER,
        CANDIDATE,
        COMMITTEE
    }
    mapping(address=>Role) public roles;
    mapping(uint=>Candidate) public candidates;
    mapping(address=>bool) public voters;
    uint public candidateCount;
    event votedEvent (
        uint indexed _candidateId
    );
    event candidateAdded(
        string _name
    );
     modifier onlyCommitte {
        require(roles[msg.sender] == Role.COMMITTEE,"err");
        _;
    }
    constructor() public{
        roles[msg.sender] = Role.COMMITTEE;
        defAddCandidate("candidate1");
        defAddCandidate("candidate2");
    }
    function defAddCandidate(string memory _name) private{
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount,_name,0);
    }
      function addCandidate (string memory _name) onlyCommitte public {
        candidateCount ++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);

        // emit candidate added event
        emit candidateAdded(_name);
    }
    function vote(uint _candidateId) public{
        require(voters[msg.sender]==false,"voted Already");
        require(_candidateId<=candidateCount&&_candidateId>0,"Invalid Candidate Id");
        voters[msg.sender] = true;
        candidates[_candidateId].votes++;
        emit votedEvent(_candidateId);
    }

}