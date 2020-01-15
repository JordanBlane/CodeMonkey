import React from 'react';
import './CSS/App.css'
const hostname = window.location.hostname;


export class LoginPage extends React.Component {

  constructor(props){
    super(props);

    try{
      let nameFromCookie = decodeURIComponent(document.cookie);
      nameFromCookie = nameFromCookie.split('=');
      nameFromCookie = nameFromCookie[1];
      console.log('Name from cookie: ' +nameFromCookie);
      if(nameFromCookie){
        document.location.href = `http://${hostname}:3000/main`
      }
    }
    catch(err){
      console.log(err)
    }
  }

  Login = () => {
    var username = document.getElementById('usernameinput').value;
    var password = document.getElementById('passwordinput').value;

    fetch(`http://localhost:4000/api/verifylogin?name=${username}&password=${password}`)
    .then(response => response.json())
    .then((data)=>{
      if (data == true){
        console.log('logged in');
        document.cookie = `username=${username};`;
        document.location.href = `http://${hostname}:3000/main`;
      }else{
        console.log('error')
      }
    })
  }

  Signup = () => {
    var username = document.getElementById('usernameinput').value;
    var password = document.getElementById('passwordinput').value;

    fetch(`http://localhost:4000/api/adduser?name=${username}&password=${password}`)
    .then(response => response.json())
    .then((data)=>{
      if(data.data == 'user exsists'){
        console.log('exists')
      }else{
        console.log('added')
      }
    })
  }

  render(){
    return(
      <div className="loginPageWrapper">
        <div className="topBar">
          <input id="usernameinput" placeholder="Username"/>
          <input id="passwordinput" placeholder="Password" type="password"/>
          <button id="loginbutton" onClick={this.Login}>Login</button>
          <button id="signupbutton" onClick={this.Signup}>Sign Up</button>
        </div>
      </div>
    )
  }
}