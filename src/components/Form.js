import React from 'react'

const ROLES = [
    "VOTER",
    "CANDIDATE",
    "COMMITTEE"
];


class Form extends React.Component {
  render() {
    return (
        ROLES[this.props.role] === "COMMITTEE" ?
            <form onSubmit={(event) => {
                event.preventDefault();
                this.props.addCandidate(this.candidateName.value);
            }}>
                <div className='form-group'>
                    <label>Add Candidate</label>
                    <input type="text" ref={(input) => this.candidateName= input} className='form-control'>

                    </input>
                </div>
                <button type='submit' className='btn btn-primary'>Add Candidate</button>
                <hr/>
            </form> :
            <form onSubmit={(event) => {
                event.preventDefault();
                this.props.castVote(this.candidateId.value);
            }}>
                <div className='form-group'>
                    <label>Select Candidate</label>
                    <select ref={(input) => this.candidateId = input} className='form-control'>
                        {this.props.candidates.map((candidate) => {
                            return <option value={candidate.id} key={candidate.id}>{candidate.name}</option>
                        })}
                    </select>
                </div>
                <button type='submit' className='btn btn-primary'>Vote</button>
                <hr/>
            </form>

    )
  }
}

export default Form