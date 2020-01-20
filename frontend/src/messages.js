import React from 'react';
import './CSS/messages.css'
const hostname = window.location.hostname;


export class MessagePage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
        profile:"",
        currentMessage:"",
        popupstate:false,
        frienddiv : false,
        openchats : [],
        messagelength : 0,
        friendrequestdiv : false

    }

    this.InitialiseUser.bind(this);
    this.InitialiseUser();

    document.body.addEventListener("keydown",(e)=>{
        if(e.keyCode == 13){
            //enter key pressed
            this.sendmessage();
            document.getElementById('messageinput').value = ''
        }
    })

    setInterval(()=>{
        this.getmessageslength();
    }, 1000)

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
            document.getElementById('usersavatarbar').src=`${data.data[0].avatar}`
            this.getmessage()
            this.addfriendrequest();
            let openchats = this.state.profile.openchats.split(';')
            console.log(openchats)
            console.log(this.state.openchats)
            for(let i=1;i<openchats.length;i++){
                document.getElementById('openchatsdiv').innerHTML += `<button class='openchatevent' id="Chatbutton"><img id='openchatavatar'/>${openchats[i]}</button>`
                console.log('a')
            }
            console.log(document.getElementsByClassName('openchatevent').length)
            for(let i=0;i<document.getElementsByClassName('openchatevent').length;i++){
                fetch(`http://${hostname}:4000/api/profile?name=${openchats[i+1]}`)
                .then(response => response.json())
                .then((data)=>{
                    document.getElementsByClassName('openchatevent')[i].childNodes[0].src=`${data.data[0].avatar}`
                })
                document.getElementsByClassName('openchatevent')[i].addEventListener('click',(e)=>{
                    console.log('a')
                    this.openchat(openchats[i+1])
                })
            }
        })
    }else{
        document.location.href=`http://${hostname}:3000/`
    }
}


    getopenchats = () => {
        let openchats = this.state.profile.openchats.split(';')
        for(let i=1;i<openchats.length;i++){
            if(this.state.openchats[i] !== openchats[i]){
                document.getElementById('openchatsdiv').innerHTML += `<button class='openchatevent' id='Chatbutton'><img id="openchatavatar"/>${openchats[i]}</button>`
            }
        }
        for(let i=0;i<document.getElementsByClassName('openchatevent').length;i++){
            document.getElementsByClassName('openchatevent')[i].addEventListener('click',(e)=>{
                this.openchat(openchats[i+1])
            })
        }
    }


    refreshopenchats = () => {
        document.getElementById('openchatsdiv').innerHTML = ''
        fetch(`http://${hostname}:4000/api/profile?name=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
            this.setState({ profile : data.data[0]})
            document.getElementById('usersavatarbar').src=`${data.data[0].avatar}`
            this.getmessage()
            let openchats = this.state.profile.openchats.split(';')
            console.log(openchats)
            console.log(this.state.openchats)
            for(let i=1;i<openchats.length;i++){
                document.getElementById('openchatsdiv').innerHTML += `<button class='openchatevent' id="Chatbutton"><img id='openchatavatar'/>${openchats[i]}</button>`
                console.log('a')
            }
            console.log(document.getElementsByClassName('openchatevent').length)
            for(let i=0;i<document.getElementsByClassName('openchatevent').length;i++){
                fetch(`http://${hostname}:4000/api/profile?name=${openchats[i+1]}`)
                .then(response => response.json())
                .then((data)=>{
                    document.getElementsByClassName('openchatevent')[i].childNodes[0].src=`${data.data[0].avatar}`
                })
                document.getElementsByClassName('openchatevent')[i].addEventListener('click',(e)=>{
                    console.log('a')
                    this.openchat(openchats[i+1])
                })
            }
        })
    }

    frienddiv = () => {
        if(this.state.frienddiv == false){
            document.getElementById('addfrienddiv').style.display = 'block'
            this.setState({ frienddiv : true})
        }else{
            document.getElementById('addfrienddiv').style.display = 'none'
            this.setState({ frienddiv : false})
        }
    }

    friendrequestdiv = () => {
        if(this.state.friendrequestdiv == false){
            document.getElementById('friendrequestdiv').style.display = 'block'
            this.setState({friendrequestdiv : true})
        }else{
            document.getElementById('friendrequestdiv').style.display = 'none'
            this.setState({friendrequestdiv : false})
        }
    }

    addfriendrequest = () => {
        fetch(`http://${hostname}:4000/api/getfriendrequests?username=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
            var requests = data.data[0].friendrequests.split(';')
            var div = document.getElementById('showfriendrequests')
            console.log(requests)
            for(let i=1;i<requests.length;i++){
                div.innerHTML += `<div id="friendreqresultdiv"><img id="friendreqresultavatar"'/><h4 id="friendreqresultname">${requests[i]}</h4> <button class="friendreqbutton" id="friendreqresultaddbutton">Add</button></div>`
            }
            for(let i=0;i<document.getElementsByClassName('friendreqbutton').length;i++){
                fetch(`http://${hostname}:4000/api/profile?name=${requests[i+1]}`)
                .then(response => response.json())
                .then((data)=>{
                    console.log(data)
                    console.log(document.getElementsByClassName('friendreqbutton')[i].parentNode.childNodes[0].src=`${data.data[0].avatar}`)
                })
            }
            for(let i=0;i<document.getElementsByClassName('friendreqbutton').length;i++){
                document.getElementsByClassName('friendreqbutton')[i].addEventListener('click',(e)=>{
                    this.addfriend(`${requests[i+1]}`)
                    fetch(`http://${hostname}:4000/api/removefriendrequest?username=${this.state.profile.username}&friendname=${requests[i+1]}`)
                    .then(response => response.json())
                    .then((data)=>{

                    })
                })
            }
        })
    }

    refreshpopup = () => {
        document.getElementById('popupdiv').style.display = 'block'
        this.setState({ popupstate : true})
        fetch(`http://${hostname}:4000/api/getfriends?username=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
            document.getElementById('showfriendsdiv').innerHTML = ''
            let friends = data.data[0].friends.split(';')
            for(let i=1;i<friends.length;i++){
                document.getElementById('showfriendsdiv').innerHTML += `<div id="frienddiv"><img id="friendsshowavatar"'/><h4 id="showfriendname">${friends[i]}</h4> <button class="friend" id="friendchatbutton">Chat</button></div>`
            }
            for(let i=1;i<document.getElementsByClassName('friend').length+1;i++){
                fetch(`http://${hostname}:4000/api/profile?name=${friends[i]}`)
                .then(response => response.json())
                .then((data)=>{
                    console.log(data)
                    document.getElementsByClassName('friend')[i-1].parentNode.childNodes[0].src=`${data.data[0].avatar}`
                })
            }
            for(let i=0;i<document.getElementsByClassName('friend').length;i++){
                document.getElementsByClassName('friend')[i].addEventListener('click',(e)=>{
                    var name = e.target.parentNode.childNodes[1].innerHTML
                    fetch(`http://${hostname}:4000/api/addopenchat?username=${this.state.profile.username}&friendname=${name}`)
                    .then(response => response.json())
                    .then((data)=>{
                        console.log(this.state.openchats)
                        let newopenchats = this.state.openchats
                        console.log(name)
                        newopenchats[newopenchats.length] = name
                        this.setState({openchats : newopenchats})
                        console.log('added')
                        console.log(this.state.openchats)
                        this.getmessage()
                    })
                })
            }
        })
    }

    showpopup = () => {
        if(this.state.popupstate == false){
            document.getElementById('popupdiv').style.display = 'block'
            this.setState({ popupstate : true})
            fetch(`http://${hostname}:4000/api/getfriends?username=${this.state.profile.username}`)
            .then(response => response.json())
            .then((data)=>{
                document.getElementById('showfriendsdiv').innerHTML = ''
                let friends = data.data[0].friends.split(';')
                for(let i=1;i<friends.length;i++){
                    document.getElementById('showfriendsdiv').innerHTML += `<div id="frienddiv"><img id="friendsshowavatar"'/><h4 id="showfriendname">${friends[i]}</h4> <button class="friend" id="friendchatbutton">Chat</button></div>`
                }
                for(let i=1;i<document.getElementsByClassName('friend').length+1;i++){
                    fetch(`http://${hostname}:4000/api/profile?name=${friends[i]}`)
                    .then(response => response.json())
                    .then((data)=>{
                        console.log(data)
                        document.getElementsByClassName('friend')[i-1].parentNode.childNodes[0].src=`${data.data[0].avatar}`
                    })
                }
                for(let i=0;i<document.getElementsByClassName('friend').length;i++){
                    document.getElementsByClassName('friend')[i].addEventListener('click',(e)=>{
                        var name = e.target.parentNode.childNodes[1].innerHTML
                        fetch(`http://${hostname}:4000/api/addopenchat?username=${this.state.profile.username}&friendname=${name}`)
                        .then(response => response.json())
                        .then((data)=>{
                            console.log(this.state.openchats)
                            let newopenchats = this.state.openchats
                            console.log(name)
                            newopenchats[newopenchats.length] = name
                            this.setState({openchats : newopenchats})
                            console.log('added')
                            console.log(this.state.openchats)
                            this.getmessage()
                        })
                    })
                }
            })
        }else{
            document.getElementById('popupdiv').style.display = 'none'
            this.setState({ popupstate : false})
        }
    }

    addfriend = (name) => {
        fetch(`http://${hostname}:4000/api/addfriend?friendname=${name}&username=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
        })
    }

    searchfriends = () => {
        var div = document.getElementById('showfriendresults')
        var search = document.getElementById('friendsearch').value;
        if(search == ''){
            return div.innerHTML = ''
        }
        div.innerHTML = ''
        fetch(`http://${hostname}:4000/api/searchusers?search=${search}`)
        .then(response => response.json())
        .then((data)=>{
            for(let i=0;i<data.data.length;i++){
                div.innerHTML += `<div id="friendresultdiv"><img id="friendresultavatar"src='${data.data[i].avatar}'/><h4 id="friendresultname">${data.data[i].username}</h4> <button class="friendbutton" id="friendresultaddbutton">Add</button></div>`
            }
            for(let i=0;i<document.getElementsByClassName('friendbutton').length;i++){
                document.getElementsByClassName('friendbutton')[i].addEventListener('click',(e)=>{
                    this.addfriend(`${data.data[i].username}`)
                })
            }
        })
    }

    getmessageslength = () => {
        fetch(`http://${hostname}:4000/api/getmessages?username=${this.state.profile.username}&to=${this.state.currentMessage}`)
        .then(response => response.json())
        .then((data)=>{
            if(data.data != 'false'){
                if(this.state.messagelength < data.data.message.length){
                    console.log('newmessage')
                    this.addmessage();
                    this.setState({messagelength : data.data.message.length})
                    setTimeout(()=>{
                        var objDiv = document.getElementById("showmessages");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    },300)
                }
            }
        })
    }

    sendmessage = () => {
        let sendto = this.state.currentMessage
        let message = document.getElementById('messageinput').value;
        if(sendto !== ''){
            message = message.
            replace(/&/g,'%26').
            replace(/</g,'%3C').
            replace(/>/g,'%3E').
            replace(/=/g,"%3D").
            replace(/'/g,"").
            replace(/"/g,"").
            replace(/#/g,"%23").
            replace(/!/g,"%21").
            replace(/£/g,"%A3");
            let words = message.split(" ");
            words.forEach((word,i) =>{
              if(word.endsWith('.jpg') || word.endsWith('.png') || word.endsWith('.jpeg') || word.endsWith('.gif')){
                let url = word;
                words[i] = `<img src=${url} width=auto height=70>`; 
              }
              if(word.indexOf('www.youtube.com/watch') > -1){ 
                let Link = `http://www.youtube.com/embed/${words[i].slice(words[i].lastIndexOf('%3D')+3, word.length)}`
                let videoTemplate = `<iframe  width=300 height=70 src=${Link} frameborder=0 allow=accelerometer;autoplay;gyroscope;picture-in-picture allowfullscreen;SameSite=none;></iframe>`
                words[i] = videoTemplate;
               
            }
            })
            message = words.join(" ");
            fetch(`http://${hostname}:4000/api/sendmessage?sendto=${sendto}&username=${this.state.profile.username}&message=${message}`)
            .then(response => response.json())
            .then((data)=>{
                console.log('sent')
            })
        }
    }


  getmessage = () => {
    document.getElementById('showmessages').innerHTML = ''
    let sendto = this.state.currentMessage
    if(sendto !== ""){
        fetch(`http://${hostname}:4000/api/getmessages?to=${sendto}&username=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
            if(data.data != 'false'){
                for(let i=0;i<data.data.message.length;i++){
                    let name = data.data.message[i].split("℗")[0]
                    let text = data.data.message[i].split("℗")[1]
                    fetch(`http://${hostname}:4000/api/profile?name=${name}`)
                    .then(response => response.json())
                    .then((data)=>{
                        let messageTemplate = `<div id="messagecontainer"><img id="messageavatar"src="${data.data[0].avatar}"/><p class="messageName">${name}: <span id='messageMessage'>${text}</span></p>`
                        document.getElementById('showmessages').innerHTML += messageTemplate;
                    })
                }
            }
        })
    }
  }

  addmessage = () => {
    let sendto = this.state.currentMessage
    if(sendto !== ""){
        fetch(`http://${hostname}:4000/api/getmessages?to=${sendto}&username=${this.state.profile.username}`)
        .then(response => response.json())
        .then((data)=>{
            if(data.data != 'false'){
                    let name = data.data.message[data.data.message.length-1].split("℗")[0]
                    let text = data.data.message[data.data.message.length-1].split("℗")[1]
                    fetch(`http://${hostname}:4000/api/profile?name=${name}`)
                    .then(response => response.json())
                    .then((data)=>{
                        let messageTemplate = `<div id="messagecontainer"><img id="messageavatar"src="${data.data[0].avatar}"/><p class="messageName">${name}</p><p class="messageMessage">${text}</p>`
                        document.getElementById('showmessages').innerHTML += messageTemplate;
                    })
                }
        })
    }
  }


  openchat = (name) => {
      this.setState({currentMessage : name })
      fetch(`http://${hostname}:4000/api/getmessages?username=${this.state.profile.username}&to=${name}`)
      .then(response => response.json())
      .then((data)=>{
        document.getElementById('showmessages').innerHTML = ''
          if(data.data != 'false'){
            this.setState({messagelength : data.data.message.length})
            for(let i=0;i<data.data.message.length;i++){
                let name = data.data.message[i].split("℗")[0]
                let text = data.data.message[i].split("℗")[1]
                fetch(`http://${hostname}:4000/api/profile?name=${name}`)
                .then(response => response.json())
                .then((data)=>{
                    let messageTemplate = `<div id="messagecontainer"><img id="messageavatar"src="${data.data[0].avatar}"/><p class="messageName">${name}</p><p class="messageMessage">${text}</p>`
                    document.getElementById('showmessages').innerHTML += messageTemplate;
                    })
                }
          }
      })
  }


  render(){
    return(
      <div className="messagePageWrapper">
          <button onClick={()=>{document.location.href=`http://${hostname}:3000/main`}} id='backbuttonmessages'>Back</button>
          <button id='addfriend' onClick={()=>{this.showpopup()}}>Friends</button>
          <img id='usersavatarbar'/>
          <div id='sidebar'>
              <div id='openchatsdiv'>

              </div>

          </div>

          <input id='messageinput' placeholder='Message'/>

          <div id='showmessages'>
          </div>
          <div id='addfrienddiv'>
                <button id='closepopup' onClick={()=>{this.frienddiv();this.refreshpopup()}}>X</button>
                <input id='friendsearch' placeholder='search for friends' onChange={()=>{this.searchfriends()}}/>
                <div id='showfriendresults'>

                </div>
            </div>

            <div id='friendrequestdiv'>
            <button id='closepopup' onClick={()=>{this.friendrequestdiv();this.refreshpopup()}}>X</button>
            <div id='showfriendrequests'>

            </div>

            </div>

          <div id='popupdiv'>
            <button id='closepopup' onClick={()=>{this.showpopup();this.refreshopenchats()}}>X</button>
            <div id='showfriendsdiv'>

            </div>
            <button id='addfriendbutton' onClick={()=>{this.frienddiv()}}>Add Friend</button>
            <button id='friendrequestbutton' onClick={()=>{this.friendrequestdiv()}}>Friend Requests</button>
          </div>
      </div>
    )
  }
}