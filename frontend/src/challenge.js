import React from 'react';
import queryString from 'query-string';
import './CSS/Challenge.css'
const hostname = window.location.hostname;


export class ChallengePage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
        profile: "",
        challenge: "",
        completed:""
    }

    setTimeout(()=>{
        console.log(this.state.profile)
        fetch(`http://localhost:4000/api/checkcompleted?uid=${this.state.profile.id}&cid=${this.state.challenge.id}`)
        .then(response => response.json())
        .then((data)=>{
          if(data.data[0]){
            this.setState({completed : 'true'})
            console.log('true')
            document.getElementById('challengename').innerText += '         ✓'
          }else{
            this.setState({completed : 'false'})
            console.log('false')
          }
        })
    },90)

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
    }else{
      return document.location.href='http://localhost:3000/'
    }
    const values = queryString.parse(this.props.location.search)
    fetch(`http://localhost:4000/api/getquestions?id=${values.id}`)
    .then(response => response.json())
    .then((data)=>{
        this.setState({ challenge : data.data[0]})
    })
}

execute = () => {

  var code = document.getElementById('challengeinput').value
  var solution = this.state.challenge.solution

  code = code.replace('++','℗℗');
  code = code.replace('+','℗');

  fetch(`http://localhost:4000/api/runnode?code=${code}&solution=${solution}`)
  .then(response => response.json())
  .then((data)=>{
    var console_ = document.getElementById('consoleview')
    var date = new Date();

    console_.innerHTML += '<div id="consoletext">' +date.getHours() +':' +date.getMinutes()+' - ' +  data.data +'</div>'
    if(data.status == 'true'){
      if(this.state.completed == 'false'){
        var completediv = document.getElementById('completediv').style.display = 'block'
        fetch(`http://localhost:4000/api/addpoints?amount=${this.state.challenge.points}&name=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
          console.log(data)
        })
        fetch(`http://localhost:4000/api/addcomplete?uid=${this.state.profile.id}&cid=${this.state.challenge.id}`)
        .then(response => response.json())
        .then((data)=>{
          console.log(data)
        })
      }
    }
  })
}

  render(){
    return(
      <div className="challengePageWrapper">
          <div className = "topBar">
          <button id='backbutton' type='submit' onClick={() => {document.location.href = 'http://localhost:3000/main'}}>Back</button>
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
            <button id='executebutton' onClick={this.execute.bind(this)}>Execute</button>
            <div id='consoleview'>
            </div>
          </div>

          <div className='completediv' id='completediv'>
            <h2 id='completetitle'>WellDone</h2>

            <p id='completedescription'>You Got {this.state.challenge.points} points</p>
          </div>

      </div>
    )
  }
}