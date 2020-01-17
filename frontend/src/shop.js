import React from 'react';
import './CSS/Shop.css'
const hostname = window.location.hostname;




export class ShopPage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
        profile : "",
        wanttobuy : "",
        price : ""
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
            this.getShop();
        })
    }else{
        return document.location.href='http://localhost:3000/'
    }
}

buy = () => {
    fetch(`http://localhost:4000/api/buyavatar?uid=${this.state.profile.id}&avatar=${this.state.wanttobuy}&price=${this.state.price}`)
    .then(response => response.json())
    .then((data)=>{
        console.log('done')
        document.getElementById('notowneddiv').style.display = 'none';
    })
}



getShop = () => {
    var avatars = [
        "https://i.ibb.co/72XFnLn/avatar-1.jpg",
        "https://i.ibb.co/BrbHGPS/avatar-2.jpg",
        "https://i.ibb.co/Qdtcyxm/avatar-3.jpg",
        "https://i.ibb.co/zb3DpNJ/avatar-4.png",
        "https://i.ibb.co/jbHmC7R/avatar-5.jpg",
        "https://i.ibb.co/FYXgYkX/avatar-6.png",
        "https://i.ibb.co/KVW7s1C/avatar-7.jpg",
        "https://i.ibb.co/S6jCP4p/avatar-8.jpg",
        "https://i.ibb.co/Xpk1LMQ/avatar-9.jpg",
        "https://i.ibb.co/T1GbPZR/avatar-10.jpg",
        "https://i.ibb.co/pPDYxZJ/avatar-11.jpg",
        "https://i.ibb.co/p3WR7m9/avatar-12.jpg",
        "https://i.ibb.co/VvHPg7g/avatar-13.png",
        "https://i.ibb.co/MSzLhsg/avatar-14.png",
        "https://i.ibb.co/kGkJ7mg/avatar-15.png",
        "https://i.ibb.co/ggkZ0Cj/avatar-16.png",
        "https://i.ibb.co/80rDr3d/avatar-17.png",
        "https://i.ibb.co/6NP3D1H/avatar-18.png",
        "https://media.giphy.com/media/XDQlnKOjTPOwi42t1a/giphy.gif",
        "https://media.giphy.com/media/LnKICo0iGuYF3mk4GG/giphy.gif",
        "https://media.giphy.com/media/SYQKLcHWCJCkMy6xHG/giphy.gif",
        "https://media.giphy.com/media/ZECBD5y4hOiwjyYMeI/giphy.gif",
        "https://media.giphy.com/media/hvRm4ebcmtxFUJ37JN/giphy.gif",
        "https://media.giphy.com/media/f3FDJR5xnzTIyyMm78/giphy.gif",
        "https://media.giphy.com/media/ll0jbnlzVw1DPaGenn/giphy.gif",
        "https://media.giphy.com/media/iKA4n7sIGsyiV1iIWc/giphy.gif",
        "https://media.giphy.com/media/W5IX00rvcC4rTejj9u/giphy.gif"
    ]
    for(let i=0;i<avatars.length;i++){
            document.getElementById('showavatarsdiv').innerHTML += '<img class="loop" id="avatardisplayimage" src='+avatars[i]+' />'
    }
    for(let i=0;i<document.getElementsByClassName('loop').length;i++){
        document.getElementsByClassName('loop')[i].addEventListener('click',(e)=>{
            fetch(`http://localhost:4000/api/unlocked?uid=${this.state.profile.id}&avatar=${e.target.src}`)
            .then(response => response.json())
            .then((data)=>{
                if(data.data[0]){
                    console.log('you own this')
                    fetch(`http://localhost:4000/api/setavatar?avatar=${e.target.src}&uid=${this.state.profile.id}`)
                    .then(response => response.json())
                    .then((data)=>{
                        console.log(data)
                    })
                }else{
                    console.log('you dont own this')
                    //take points set pfp
                    document.getElementById('notowneddiv').style.display = 'block';
                    this.setState({wanttobuy : e.target.src})
                    document.getElementById('imagepreview').src=`${this.state.wanttobuy}`
                    fetch(`http://localhost:4000/api/getprice?avatar=${e.target.src}`)
                    .then(response => response.json())
                    .then((data)=>{
                        document.getElementById('imagepoints').innerHTML = `Points: ${data.data[0].points}`
                        this.setState({price : data.data[0].points})
                    })
                }
            })
            if(this.state.profile.avatar == e.target.src){
                console.log('this is your avatar')
            }
        }) 
    }
}

  render(){
    return(
      <div className="shopPageWrapper">
          <h2 id='avatarstitle'>Avatars</h2>
        <h4 id='showpoints'>Points: {this.state.profile.points}</h4>
        <button onClick={()=>{document.location.href='http://localhost:3000/main'}}>Back</button>
        <div id='showavatarsdiv'>

        </div>
        <div id='notowneddiv'>
            <h4>DO YOU WANT TO BUY?</h4>
            <p id='imagepoints'></p>
            <button onClick={()=>{this.buy()}}>Yes</button>
            <button onClick={()=>{document.getElementById('notowneddiv').style.display = 'none';}}>No</button>
            <img id='imagepreview'/>
        </div>
      </div>
    )
  }
}
