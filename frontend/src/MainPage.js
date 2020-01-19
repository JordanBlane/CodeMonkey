import React from 'react';
import './CSS/MainPage.css';
const hostname = window.location.hostname;

export class MainPage extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            profile: "",
            image : null,
            messagesopen : false,
            pointstonextlevel : 0
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
                document.getElementById('avatar').src=`${data.data[0].avatar}`
                var pointsto = data.data[0].levelup - data.data[0].points
                if(pointsto > 0){
                    this.setState({pointstonextlevel : pointsto})
                    document.getElementById('levelupbutton').style.display = 'none'
                }else{
                    document.getElementById('pointsto').style.display = 'none'
                }
            })
        }else{
            document.location.href=`http://${hostname}:3000/`
        }
    }




    search = () => {
        var searchBarInput = document.getElementById('searchBar').value;

        fetch(`http://${hostname}:4000/api/showquestions?questionname=${searchBarInput}`)
        .then(response => response.json())
        .then((data)=>{
            var searchresultsdiv = document.getElementById('searchResults');

            if(searchBarInput == ''){
                searchresultsdiv.innerHTML = '';
                searchresultsdiv.style.display = 'none';
                return false;
            }

            searchresultsdiv.innerHTML = '';

            if(data[0]){
                searchresultsdiv.style.display = 'inline-block';
                for(let i=0;i<data.length;i++){
                    var id = '';

                    fetch(`http://${hostname}:4000/api/getquestions?id=${data[i].id}`)
                    .then(response => response.json())
                    .then((data)=>{
                        fetch(`http://${hostname}:4000/api/checkcompleted?uid=${this.state.profile.id}&cid=${data.data[0].id}`)
                        .then(response => response.json())
                        .then((data_)=>{
                            if(data_.data[0]){
                                searchresultsdiv.innerHTML += `<div id='showquestiondiv'> <h3 id="questionName">${data.data[0].name}    ✓</h3> <p id="questionDiscription">${data.data[0].description}</p> <p id="questionLanguage">${data.data[0].language}</p><button id="questionButton" onClick={document.location.href='http://${hostname}:3000/challenge?id=${data.data[0].id}'}>Go To Challenge</button></div>`
                            }else{
                                searchresultsdiv.innerHTML += `<div id='showquestiondiv'> <h3 id="questionName">${data.data[0].name}</h3> <p id="questionDiscription">${data.data[0].description}</p> <p id="questionLanguage">${data.data[0].language}</p><button id="questionButton" onClick={document.location.href='http://${hostname}:3000/challenge?id=${data.data[0].id}'}>Go To Challenge</button></div>`
                            }
                        })
                    })
                }
            }else{
                searchresultsdiv.style.display = 'hidden';
                searchresultsdiv.innerHTML = '';
            }
        })
    }


    levelup = () => {
        fetch(`http://${hostname}:4000/api/levelup?uid=${this.state.profile.id}`)
        .then(response => response.json())
        .then((data)=>{
            console.log(data)
        })
    }


    render(){
        return(
            <div className="mainPageWrapper" id='mainPageWrapper'>
                <img id='avatar' onClick={()=>{document.location.href=`http://${hostname}:3000/profile`}}/>
                <h2 id='usernamedisplay'>{this.state.profile.username}</h2>
                <button id='logoutbutton' onClick={()=>{document.cookie = 'username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';document.location.href=`http://${hostname}:3000/`}}>Log Out</button>
                <button id='shopbutton' onClick={()=>{document.location.href=`http://${hostname}:3000/shop`}}>shop</button>
                <button id='messagesbutton' onClick={()=>{document.location.href=`http://${hostname}:3000/messages`}}>Messages</button>
                <button id='settingsbutton'>⚙</button>
        <h4 id='userslevel'>Level: {this.state.profile.level} - <span id='pointsto'>Points till next level: {this.state.pointstonextlevel}</span></h4>
                <h4 id='userspoints'>Points: {this.state.profile.points}</h4>

                <div className="topBar"></div>
                <button id='levelupbutton' onClick={()=>{this.levelup()}}>Level Up</button>

                <div className="searchDiv">
                    <input id='searchBar' onChange={this.search} placeholder="search for challenges"/>
                    <div id='searchResults'>
                    </div>
                </div>
                <div id='mainpagediv'>
                    <button id='togglemessages' onClick={()=>{this.togglemessages()}}>Show Messages</button>
                    <div className='messageDiv' id='messagediv'>
                        <div className='chooselanguage'>
                            <button className='chooselanguagebutton' onClick={()=>{this.setState({message:'javascript'})}}>Javascript</button>
                            <button className='chooselanguagebutton' onClick={()=>{this.setState({message:'c'})}}>C</button>
                            <button className='chooselanguagebutton' onClick={()=>{this.setState({message:'c++'})}}>C++</button>
                            <button className='chooselanguagebutton' onClick={()=>{this.setState({message:'python'})}}>Python</button>
                        </div>
                        <div className='showmessagesdiv' id='showmessagesdiv'>
                            
                            </div>
                        <input id='messageinput' placeholder='Send a message'/>
                    </div>
                </div>
            </div>
        )
    }
}