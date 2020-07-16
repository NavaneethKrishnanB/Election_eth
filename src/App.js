import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from '@truffle/contract'
import Election from '../build/contracts/Election.json'
import Content from './components/Content'
import 'bootstrap/dist/css/bootstrap.css'


class App extends React.Component {
   constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      candidates: [],
      hasVoted: false,
     
      role: null,
    };
    this.castVote = this.castVote.bind(this);
  this.addCandidate = this.addCandidate.bind(this);
  
  }

  async loadWeb3()
  {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
 async componentDidMount() {
  await this.loadWeb3();
    // TODO: Refactor with promise chain
  const web3 = window.web3;
  console.log("web3",web3);
  if (typeof (web3) != 'undefined') {
    this.web3Provider = web3.currentProvider
  } else {
    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
  }

  this.web3 = new Web3(this.web3Provider)
  
  this.election = TruffleContract(Election);
  this.election.setProvider(this.web3Provider);

   this.web3.eth.getCoinbase((err, account) => {

      this.setState({ account:account });
      console.log("acc",account,this.state.account);
      this.election.deployed().then((electionInstance) => {
        console.log("electionInst",electionInstance);
        electionInstance.candidateCount().then((cc)=>{
          
          console.log("cc",cc.toNumber())});
        this.electionInstance = electionInstance;
        this.parseCandidates();
        console.log(this.state.candidates);
       
        this.electionInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted})
        });
          this.electionInstance.roles(this.state.account).then((role) => {
            console.log(role.toString());
              this.setState({role})
          })
      })
    });
    
  }



  parseCandidates() {
      console.log("parse");
      this.electionInstance.candidateCount().then((candidatesCount) => {
        var totalCandidates =0;
      
        if(typeof candidatesCount != undefined)
        totalCandidates = candidatesCount.toNumber();
        
          let candidates = [];
          for (let i = 1; i <= totalCandidates; i++) {
              this.electionInstance.candidates(i).then((candidate) => {
                  candidates.push({
                      id: candidate[0],
                      name: candidate[1],
                      votes: candidate[2]
                  });
                  this.setState({ candidates: candidates })
              });
          }
      });

  }


  parseVotes() {

      this.electionInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted})
      });
  }

  castVote(candidateId) {
   
    this.electionInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
    )
  }


  addCandidate(candidateName) {
       
        this.electionInstance.addCandidate(candidateName, { from: this.state.account }).then((result) =>
            this.setState({ hasVoted: true })
        )
    }

  render() {
    return (
      <div className='row'>
        <div className='col-lg-12 text-center' >
          <h1>Election Dashboard</h1>
          <br/>
           <Content
                role={this.state.role}
                account={this.state.account}
                candidates={this.state.candidates}
                hasVoted={this.state.hasVoted}
                castVote={this.castVote}
                addCandidate={this.addCandidate}
              />
          
        </div>
      </div>
    )
  }
}
export default App;
