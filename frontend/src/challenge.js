import React from 'react';
import queryString from 'query-string';
import './CSS/Challenge.css'
const hostname = window.location.hostname;


export class ChallengePage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
        profile: "",
        challenge: ""
    }

    this.InitialiseUser.bind(this);
    this.InitialiseUser();
  }

  InitialiseUser(){

    let nameFromCookie = decodeURIComponent(document.cookie);
    nameFromCookie = nameFromCookie.split('=');
    let username = nameFromCookie[1];
    if(username != '' || username != undefined){
        fetch(`http://localhost:4000/api/profile?name=${username}`)
        .then(response => response.json())
        .then((data)=>{
            this.setState({ profile : data.data[0]})
        })
    }
    const values = queryString.parse(this.props.location.search)
    fetch(`http://localhost:4000/api/getquestions?id=${values.id}`)
    .then(response => response.json())
    .then((data)=>{
        this.setState({ challenge : data.data[0]})
    })
}

  render(){
    return(
      <div className="challengePageWrapper">
          <div className = "topBar">
          <div className="topbardiv">
                <button id='settingsbutton'>settings</button>
                <button id='profilebutton'>profile</button>
                <h4 id='userslevel'>{this.state.profile.level}</h4>
                <h4 id='userspoints'>points: {this.state.profile.points}</h4>
            </div>
          </div>
          <div className="challengediv">
            <h4 id='challengename'>{this.state.challenge.name}</h4>
            <p id='challengedescription'>{this.state.challenge.description}</p>

            <textarea id="challengeinput" placeholder="code"/>
            <div id='consoleview'>
            </div>
          </div>

      </div>
    )
  }
}