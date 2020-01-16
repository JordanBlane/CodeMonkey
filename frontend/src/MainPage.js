import React from 'react';
import './CSS/MainPage.css';
const hostname = window.location.hostname;

export class MainPage extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            profile: "",
            message:"javascript"
        }

        this.InitialiseUser.bind(this);
        this.InitialiseUser();

        setInterval(()=>{
            this.updatemessages()
            var objDiv = document.getElementById("showmessagesdiv");
            objDiv.scrollTop = objDiv.scrollHeight;
        },500);

        document.body.addEventListener("keydown",(e)=>{
        if(e.keyCode == 13){
            //enter key pressed
            this.sendmessage();
            document.getElementById('messageinput').value = '';
        }
        })
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
    }



    sendmessage = () => {
        var messageinput = document.getElementById('messageinput')

        fetch(`http://localhost:4000/api/sendmessage?language=${this.state.message}&message=${messageinput.value}&user=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
            console.log(data)
        })
    }


    updatemessages = () => {
        fetch(`http://localhost:4000/api/getmessages?language=${this.state.message}`)
        .then(response => response.json())
        .then((data)=>{
            var messagediv = document.getElementById('showmessagesdiv')

            messagediv.innerHTML = '';

            for(let i=0;i<data.data.length;i++){
                messagediv.innerHTML += `<div>` +data.data[i].user +' : ' +data.data[i].message +`</div>`
            }
        })
    }


    search = () => {
        var searchBarInput = document.getElementById('searchBar').value;

        fetch(`http://localhost:4000/api/showquestions?questionname=${searchBarInput}`)
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

                    fetch(`http://localhost:4000/api/getquestions?id=${i+1}`)
                    .then(response => response.json())
                    .then((data)=>{
                        searchresultsdiv.innerHTML += `<div id='showquestiondiv'> <h3>${data.data[0].name}</h3> <p>${data.data[0].description}</p> <button onClick={document.location.href='http://localhost:3000/challenge?id=${data.data[0].id}'}>Go To Challenge</button></div>`
                    })
                }
            }else{
                searchresultsdiv.style.display = 'hidden';
                searchresultsdiv.innerHTML = '';
            }
        })
    }


    render(){
        return(
            <div className="mainPageWrapper">
                <div className="topBar">
                     <h4 id='title'>Hello {this.state.profile.username}</h4>
                    <div className="topbardiv">
                        <button id='settingsbutton'>settings</button>
                        <button id='profilebutton'>profile</button>
                        <h4 id='userslevel'>{this.state.profile.level}</h4>
                        <h4 id='userspoints'>points: {this.state.profile.points}</h4>
                    </div>
                </div>
                <div className="searchDiv">
                    <input id='searchBar' onChange={this.search} placeholder="search for challenges"/>
                    <div id='searchResults'>
                    </div>
                </div>
                <div className='messageDiv'>
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
        )
    }
}