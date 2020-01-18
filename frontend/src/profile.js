import React from 'react';
import './CSS/profile.css'
const hostname = window.location.hostname;




export class ProfilePage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
        profile : ""
    }


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
            document.getElementById('showavatarprofile').src=`${this.state.profile.avatar}`
            this.getCompleted()
        })
    }else{
        return document.location.href=`http://${hostname}:3000/`
        }
    }


    getCompleted = () => {
        fetch(`http://${hostname}:4000/api/getcompleted?uid=${this.state.profile.id}`)
        .then(response => response.json())
        .then((data)=>{
            for(let i=0;i<data.data.length;i++){
                fetch(`http://${hostname}:4000/api/getquestions?id=${data.data[i].challengeid}`)
                .then(response => response.json())
                .then((data)=>{
                    console.log(data)
                    document.getElementById('showchallenges').innerHTML += '<div id="challengeDiv"> <h4 id="challengeTitle">'+data.data[0].question+'</h4> <p id="challengeLanguage">'+data.data[0].language+'</p></div>'
                })
            }
        })
    }

  render(){
    return(
      <div className="profilePageWrapper">
          <button id='backprofile' onClick={()=>{document.location.href=`http://${hostname}:3000/main`}}>Back</button>
          <h2 id='username'>{this.state.profile.username}</h2>
          <img id='showavatarprofile'/>

          <div className='completedChallenges'>
            <h4 id='completedchallengestitle'>Completed Challenges</h4>
            <div id='showchallenges'>

            </div>
          </div>
      </div>
    )
  }
}
