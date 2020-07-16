var Election = artifacts.require('./Election.sol')

contract("Election",async function(accounts)
{
    var electionInstance;
    it("Initialized with 2 candidates",async function(){
        return Election.deployed().then(async function(instance){
            return instance.candidateCount();
        }).then(function(count){
            assert.equal(count,2);
        })
    });
    it("initialises the candidates with correct values",async function(){
        return Election.deployed().then((instance)=>{
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then((candidate)=>{
            assert.equal(candidate[0],1,"candidate has correct id");
            //could assert candidate name here

            assert.equal(candidate[2],0,"initially 0 votes");
            return electionInstance.candidates(2);
        }).then((candidate)=>{
            assert.equal(candidate[0],2,"candidate has correct id");
            //could assert candidate name here
            
            assert.equal(candidate[2],0,"initially 0 votes");
        })
    });
    it("allows voters to cast vote",async function(){
        return Election.deployed().then((instance)=>{
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId,{from:'0x44A4372F4Fb693856785Bf1C046268B62BC5906E'})
        }).then((receipt)=>{
            assert.equal(receipt.logs.length,1,"event was triggered");
            assert.equal(receipt.logs[0].event,"votedEvent","correct event");
            
            return electionInstance.voters('0x44A4372F4Fb693856785Bf1C046268B62BC5906E')
        }).then((voted)=>{
            assert(voted,"the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then((candidate)=>{
            var voteCount = candidate[2];//this is the votes part in struct
            assert(voteCount,1,"increment votes of candidate");
        })
    });
    it("Exception due to Invalid Candidate",async ()=>{
        return Election.deployed().then((instance)=>{
            electionInstance = instance;
            return electionInstance.vote(100,{from:'0x6Df4028Ac0F1AC3bCE8c6E3478879bdE99Bb5d1c'});
        }).then(assert.fail).catch(err=>{
            assert(err.message.indexOf('revert')>=0,"err msg");
            return electionInstance.candidates(1);
        }).then((candidate1)=>{
            assert.equal(candidate1[2],1,"canidate did not recieve any votes");
            return electionInstance.candidates(2);
        }).then((candidate2)=>{
            assert.equal(candidate2[2],0,"candidate did not recieve any votes");
        })
    });
    it("multiple voting",async()=>{
        return Election.deployed().then((instance)=>{
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId,{from:'0x6Df4028Ac0F1AC3bCE8c6E3478879bdE99Bb5d1c'})
            return electionInstance.candidates(candidateId);
        }).then((candidate)=>{
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"first vote");
           return electionInstance.vote(candidateId,{from:'0x6Df4028Ac0F1AC3bCE8c6E3478879bdE99Bb5d1c'})
        }).then(assert.fail).catch(err=>{
            assert(err.message.indexOf('revert')>=0,"err msg");
            return electionInstance.candidates(1);
        }).then((candidate)=>{
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"did not recieve votes");
        })
    });
   
})