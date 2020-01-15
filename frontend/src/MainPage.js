import React from 'react';
import './CSS/MainPage.css';
const hostname = window.location.hostname;

export class MainPage extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            profile: ""
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
                    searchresultsdiv.innerHTML += `<div id='showquestiondiv'> <h3>${data[i].name}</h3> <p>${data[i].description}</p></div>`
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
                    <h4 id='title'>Code Monkey</h4>
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
            </div>
        )
    }
}