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
        fetch(`http://${hostname}:4000/api/checkcompleted?uid=${this.state.profile.id}&cid=${this.state.challenge.id}`)
        .then(response => response.json())
        .then((data)=>{
          if(data.data[0]){
            this.setState({completed : 'true'})
            document.getElementById('challengename').innerText += '         ✓'
          }else{
            this.setState({completed : 'false'})
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
        fetch(`http://${hostname}:4000/api/profile?name=${username}`)
        .then(response => response.json())
        .then((data)=>{
            this.setState({ profile : data.data[0]})
        })
    }else{
      return document.location.href=`http://${hostname}:3000/`
    }
    const values = queryString.parse(this.props.location.search)
    fetch(`http://${hostname}:4000/api/getquestions?id=${values.id}`)
    .then(response => response.json())
    .then((data)=>{
        this.setState({ challenge : data.data[0]})
        if(data.data[0].language == 'cpp'){
          document.getElementById('challengeinput').value = `#include <iostream>\n\nint main(){\n\n}`
        }else if(data.data[0].language == 'c'){
          document.getElementById('challengeinput').value = `#include <stdio.h>\n\nint main() {\n\nreturn 0;\n}`
        }
    })
}

execute = () => {

  var code = document.getElementById('challengeinput').value
  var solution = this.state.challenge.solution

  code = code.replace('++','℗℗');
  code = code.replace('+','℗');

  code = code.replace(/;/g, '¥');

  code = code.replace(/#/g, 'Ö');

  code = code.replace(/\n/g, 'Æ');


  var lan = '';

  switch(this.state.challenge.language){
    case 'javascript':
      lan = 'node';
      break;
    case 'cpp':
      lan = 'cpp';
      break;
    case 'python':
      lan = 'python';
      break;
    default:
      lan = 'null';
      break;
  }

  fetch(`http://${hostname}:4000/api/run${lan}?code=${code}&solution=${solution}`)
  .then(response => response.json())
  .then((data)=>{
    var console_ = document.getElementById('consoleview')
    var date = new Date();

    console_.innerHTML += '<div id="consoletext">' +date.getHours() +':' +date.getMinutes()+' - ' +  data.data +'</div>'
    if(data.status == 'true'){
      if(this.state.completed == 'false'){
        var completediv = document.getElementById('completediv').style.display = 'block'
        fetch(`http://${hostname}:4000/api/addpoints?amount=${this.state.challenge.points}&name=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
        })
        fetch(`http://${hostname}:4000/api/addcomplete?uid=${this.state.profile.id}&cid=${this.state.challenge.id}`)
        .then(response => response.json())
        .then((data)=>{
        })
      }
    }
  })
}

  render(){
    return(
      <div className="challengePageWrapper">
          <div className = "topBar">
          <button id='backbutton' type='submit' onClick={() => {document.location.href = `http://${hostname}:3000/main`}}>Back</button>
          <div className="topbardiv">
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