const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { runNode, runC, runCPP, runPython} = require('code-compiler');


const app = express();

function get_connection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Admin123',
        database: 'code',
        charset : 'utf8mb4'
    })
}

let connection = get_connection();


app.use(cors());

// --------- API -----------

app.get('/api',(req,res)=>{
    res.send('Code Challenge Website Api');
})


// -------- ADD USER --------

app.get('/api/adduser', (req,res)=>{
    const { name, password } = req.query;
    var random = Math.floor(Math.random() *3);
    var avatars = ['https://i.ibb.co/72XFnLn/avatar-1.jpg',"https://i.ibb.co/BrbHGPS/avatar-2.jpg","https://i.ibb.co/Qdtcyxm/avatar-3.jpg"]
    const ADD_USER = `INSERT INTO users(username,password,level,points,avatar,levelup,messages,friends,friendrequests,openchats,groupchats) VALUES('${name}', '${password}',0,0,'${avatars[random]}',100,'"example":{"message":[""]}','','','','')`
    const FIND_USER = `SELECT * FROM users WHERE username="${name}"`

    if(name != '' || undefined && password != '' || undefined){

        connection.query(FIND_USER,(err,result)=>{
            if(err){return console.log(err)}

            if(!result[0]){
                connection.query(ADD_USER,(err,results)=>{
                    if(err){return console.log(err)}
                    const GET_USER_OBJECT = `SELECT * FROM users WHERE username='${name}' AND password='${password}'`

                    connection.query(GET_USER_OBJECT,(err,ress)=>{
                        if(err){return console.log(err)}
                        const GET_AVATARS = `INSERT INTO unlockedavatar(uid,avatar) VALUES('${ress[0].id}','${avatars[random]}')`
                        connection.query(GET_AVATARS,(err,resss)=>{
                            if(err){return console.log(err)}
                            console.log('new user : ' +ress[0].username)
                            return res.json({ data : 'user added'});
                        })
                    })
                })
            }else{
                return res.json({ data : 'user exsists' });
            }
        })
    }else{
        return res.json({data : 'no input'})
    }


})


// ------- VERIFY LOGIN --------

app.get('/api/verifylogin', (req,res)=>{
    const { name, password } = req.query;
    const VERIFY_LOGIN = `SELECT * FROM users WHERE username="${name}"`
    connection.query(VERIFY_LOGIN,(err,results) => {
        if(err){return console.log(err)}
        if(results[0]){
            if(results[0].password == password){
                return res.send("true");
            }
        }
        return res.send("false");
    })
})


// -------  GET PROFILE -------

app.get('/api/profile',(req,res)=>{
    const { name } = req.query;
    const GET_PROFILE = `SELECT * FROM users WHERE username="${name}"`

    connection.query(GET_PROFILE,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result })
    })
})

// ------- GET POINTS --------

app.get('/api/getpoints', (req,res)=>{
    const { name } = req.query;
    const GET_POINTS = `SELECT points FROM users WHERE username="${name}"`

    connection.query(GET_POINTS,(err,result)=>{
        if(err){return console.log(err)}

        return res.json({ data : result[0]});
    })
})

// ------- UPDATE POINTS --------

app.get('/api/addpoints', (req,res)=>{
    const { name, amount } = req.query;
    const ADD_POINTS = `UPDATE users SET points = points + ${amount} WHERE username="${name}"`

    connection.query(ADD_POINTS,(err,result)=>{
        if(err){return console.log(err)}
        return res.send('true');
    })
})

// -------- DISPLAY QUESTIONS --------

app.get('/api/showquestions',(req,res)=>{
    const { questionname } = req.query;
    const GET_QUESTIONS = `SELECT * FROM challenges WHERE question LIKE '%${questionname}%' OR language LIKE '%${questionname}%'`

    connection.query(GET_QUESTIONS,(err,result)=>{
        if(err){return console.log(err)}
        return res.send(result)
    })
})


// --------- GET A QUESTION ----------

app.get('/api/getquestions',(req,res)=>{
    const { id } = req.query;
    const GET_QUESTION = `SELECT * FROM challenges WHERE id="${id}"`;

    connection.query(GET_QUESTION,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result})
    })
})

// ------- ADD A QUESTION ----------

app.get('/api/addquestion',(req,res)=>{
    const { questionname, question, solution, language, description } = req.query;
    const ADD_QUESTION = `INSERT INTO challenges(question,solution,language,name,description) VALUES('${question}','${solution}','${language}','${questionname}','${description}')`

    connection.query(ADD_QUESTION,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : 'added'})
    })
})


// ------- RUN NODE CODE --------

app.get('/api/runnode',(req,res)=>{
    var { code, solution } = req.query;

    code = code.replace('℗℗','++');
    code = code.replace('℗','+');

    solution = solution.replace(/℗/g, '\n')

    
    runNode(code,'',cb = (err,result) => {
        if(result.substring(0,result.lastIndexOf("\n")) == solution){
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n"))+'  >> correct', status : 'true'})
        }else{
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n")) +'  >> wrong', status : 'false'})
        }
    })

})


// --------- RUN CPP CODE --------

app.get('/api/runcpp',(req,res)=>{
    var { code, solution } = req.query;

    code = code.replace('℗℗','++');
    code = code.replace('℗','+');
  
    code = code.replace(/¥/g, ';');
  
    code = code.replace(/Ö/g, '#');

    code = code.replace(/Æ/g, '\n');

    solution = solution.replace(/℗/g, '\n')

    runCPP(code,'',cb= (err,result)=>{
        if(result.substring(0,result.lastIndexOf("\n")) == solution){
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n"))+'  >> correct', status : 'true'})
        }else{
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n")) +'  >> wrong', status : 'false'})
        }
    })
})





// --------- RUN PYTHON CODE --------

app.get('/api/runpython',(req,res)=>{
    var { code, solution } = req.query;

    code = code.replace('℗℗','++');
    code = code.replace('℗','+');

    solution = solution.replace(/℗/g, '\n')

    runPython(code,'',cb= (err,result)=>{
        console.log(result)
        if(result.substring(0,result.lastIndexOf("\n")) == solution){
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n"))+'  >> correct', status : 'true'})
        }else{
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n")) +'  >> wrong', status : 'false'})
        }
    })
})


// ------ CHECK COMPLETED ------


app.get('/api/checkcompleted',(req,res)=>{
    const { uid, cid } = req.query;
    const CHECK_COMPLETED = `SELECT * FROM completed WHERE userid='${uid}' AND challengeid='${cid}'`

    connection.query(CHECK_COMPLETED,(err,result)=>{
        if(err){return console.log(err)}

        return res.json({ data : result})
    })
})


// ------ ADD COMPLETE -------

app.get('/api/addcomplete',(req,res)=>{
    const { uid, cid } = req.query;
    const ADD_COMPLETE = `INSERT INTO completed(userid, challengeid) VALUES('${uid}','${cid}')`

    connection.query(ADD_COMPLETE,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({data:'true'})
    })
})



// -------- BUY AVATAR --------

app.get('/api/buyavatar',(req,res)=>{
    const { uid, avatar, price } = req.query;
    const FIND_POINTS = `SELECT points FROM users WHERE id='${uid}'`

    connection.query(FIND_POINTS,(err,result)=>{
        if(err){return console.log(err)}
        const TAKE_AWAY_POINTS = `UPDATE users SET points = points - ${price} WHERE id=${uid}`
        console.log(result[0].points)
        console.log(price)
        if(price > result[0].points){
            console.log('less')
            return res.json({data : 'false'})
        }else{
            connection.query(TAKE_AWAY_POINTS,(err,results)=>{
                if(err){return console.log(err)}
                const ADD_AVATAR = `INSERT INTO unlockedavatar(uid,avatar) VALUES(${uid},'${avatar}')`
                connection.query(ADD_AVATAR,(err,ress)=>{
                    if(err){return console.log(err)}
                    return res.json({data:'done'})
                })
            })
        }
    })
})


// ------- UNLOCKED AVATAR --------

app.get('/api/unlocked',(req,res)=>{
    const { uid, avatar } = req.query;
    const FIND_UNLOCKED = `SELECT * FROM unlockedavatar WHERE uid=${uid} AND avatar='${avatar}'`

    connection.query(FIND_UNLOCKED,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result})
    })
})


// -------  SET AVATAR --------

app.get('/api/setavatar',(req,res)=>{
    const { avatar, uid } = req.query;
    const SET_AVATAR = `UPDATE users SET avatar='${avatar}' WHERE id=${uid}`

    connection.query(SET_AVATAR,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({data : 'true'})
    })
})


// ------- GET PRICE ------

app.get('/api/getprice',(req,res)=>{
    const { avatar } = req.query;
    const GET_PRICE = `SELECT points FROM avatarpoints WHERE avatar='${avatar}'`

    connection.query(GET_PRICE,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result })
    })
})

// -------- GET COMPLETED CHALLENGES --------

app.get('/api/getcompleted',(req,res)=>{
    const { uid } = req.query;
    const GET_COMPLETED = `SELECT * FROM completed WHERE userid=${uid}`

    connection.query(GET_COMPLETED,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result })
    })
})


// ---------- CHECK LEVEL UP -----------


app.get('/api/levelup',(req,res)=>{
    const { uid } = req.query;
    const GET_OBJ = `SELECT * FROM users WHERE id=${uid}`

    connection.query(GET_OBJ,(err,result)=>{
        if(err){return console.log(err)}
        if(result[0].points >= result[0].levelup){
            var level = result[0].level
            var levelup = result[0].levelup

            const TAKE_AWAY_POINTS = `UPDATE users SET points=${result[0].points} - ${result[0].levelup} WHERE id=${uid}`

            connection.query(TAKE_AWAY_POINTS,(err,results)=>{
                if(err){return console.log(err)}
                
                const SET_LEVEL = `UPDATE users SET level=${level} + 1 WHERE id=${uid}`

                connection.query(SET_LEVEL,(err,ress)=>{
                    if(err){return console.log(err)}

                    const SET_LEVELUP = `UPDATE users SET levelup=${levelup} + ${levelup} WHERE id=${uid}`

                    connection.query(SET_LEVELUP,(err,resss)=>{
                        if(err){return console.log(err)}
                    })
                })
            })
        }else{
        }
    })
})


// ---------- SEND MESSAGE ------------

app.get('/api/sendmessage',(req,res) => {
    const { sendto, username, message } = req.query;
    let object = `,"${sendto}": {"message": ["${username}℗${message}"]}`
    let object2 = `,"${username}": {"message": ["${username}℗${message}"]}`
    let SEND_MESSAGE = `UPDATE users SET messages = CONCAT(messages, '${object2}') WHERE username = '${sendto}'`
    let SAVE_MESSAGE = `UPDATE users SET messages = CONCAT(messages, '${object}') WHERE username = '${username}'`
    const selectall = `SELECT messages FROM users WHERE username = '${username}'`

    connection.query(selectall,(err,result)=>{
        let StringObject = result[0].messages;
        let MessagesObject = false;
        try{
            MessagesObject = JSON.parse( "{" + StringObject + "}");
            
        }catch(err){
            MessagesObject = JSON.parse(StringObject);
        }
        
        if(Object.keys(MessagesObject).indexOf(sendto) > -1){

            let newObject = `${username}℗${message}`
            MessagesObject[sendto].message[MessagesObject[sendto].message.length] = newObject;

            
            let finalSave = JSON.stringify(MessagesObject);

            
            
            SAVE_MESSAGE = `UPDATE users SET messages= '${finalSave}' WHERE username = '${username}'`

            const GET_FRIEND = `SELECT messages FROM users WHERE username = '${sendto}'`;

            connection.query(GET_FRIEND, (err,result)=>{
                if(err){return console.log(err)}
                let StringObject2 = result[0].messages;
                let MessagesObject2 = false;
                try{
                    MessagesObject2 = JSON.parse( "{" + StringObject2 + "}");
                    
                }catch(err){
                    MessagesObject2 = JSON.parse(StringObject2);
                }
                MessagesObject2[username].message[MessagesObject2[username].message.length] = newObject;
                let finalSend = JSON.stringify(MessagesObject2);
                finalSend = finalSend.substr(1);
                finalSend = finalSend.substr(0,finalSend.length-1)
                SEND_MESSAGE = `UPDATE users SET messages= '${finalSend}' WHERE username = '${sendto}'`
                connection.query(SEND_MESSAGE, (err,result) => {
                    if(err){return console.log(err)}
                    connection.query(SAVE_MESSAGE, (err, results)=> {
                        if(err){return console.log(err)}
                        return res.json({ data : 'Success' }) 
                    })
                })
            })

            
        }else{
            connection.query(SEND_MESSAGE, (err,result) => {
                if(err){return console.log(err)}
                connection.query(SAVE_MESSAGE, (err, results)=> {
                    if(err){return console.log(err)}
                    return res.json({ data : 'Success' }) 
                })
            })
        }

    })


})



// -------- GET MESSAGES -----------

app.get('/api/getmessages',(req,res) => {
    const { username,  to } = req.query;
    const GET_MESSAGES = `SELECT messages FROM users WHERE username = '${username}'`
    connection.query(GET_MESSAGES,(err,result) => {
        if(err){return console.log(err)}
        if(result[0] != undefined){

            let StringObject = result[0].messages;
            let MessagesObject = false;
            try{
                MessagesObject = JSON.parse( "{" + StringObject + "}");
                
            }catch(err){
                MessagesObject = JSON.parse(StringObject);
            }
            if(MessagesObject[to]){
                res.json({data : MessagesObject[to]})
            }else{
                res.json({data : "false"})
        
            }
         }
    })
})

// ----------- ADD FRIENDS ----------


app.get('/api/addfriend', (req,res)=>{
    const { friendname, username } = req.query;
    const ADD_FRIEND = `UPDATE users SET friends = CONCAT(friends,';${friendname.trim()}') WHERE username='${username}'`
    const GET_FRIENDS = `SELECT friends FROM users WHERE username='${username}'`
    const SEND_FRIEND_REQUEST = `UPDATE users SET friendrequests = CONCAT(friendrequests,';${username.trim()}') WHERE username='${friendname}'`

    connection.query(GET_FRIENDS,(err,result)=>{
        if(err){return console.log(err)}
        let friendsArr = result[0].friends.split(';');
        for(let i=0;i<friendsArr.length;i++){
            if(friendsArr[i] == friendname.trim()){
                return res.json({ data : 'false'})
            }
        }
        return connection.query(ADD_FRIEND,(err,result)=>{
            if(err){return console.log(err)}
            connection.query(SEND_FRIEND_REQUEST,(err,result)=>{
                if(err){return console.log(err)}
                return res.json({ data : 'added' })
            })
        })
    })
})


// ---------- GET FRIENDS ----------

app.get('/api/getfriends',(req,res)=>{
    const { username } = req.query;
    const GET_FRIENDS = `SELECT friends FROM users WHERE username='${username}'`

    connection.query(GET_FRIENDS,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result })
    })
})

// --------- SEARCH USERS ---------

app.get('/api/searchusers',(req,res)=>{
    const { search } = req.query;
    const SEARCH_USERS = `SELECT * FROM users WHERE username LIKE '%${search}%'`

    connection.query(SEARCH_USERS,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data: result })
    })
})



//  --------- ADD OPEN CHAT ----------

app.get('/api/addopenchat',(req,res)=>{
    const { username, friendname } = req.query;
    const ADD_CHAT = `UPDATE users SET openchats = CONCAT(openchats, ';${friendname.trim()}') WHERE username='${username}'`
    const GET_CHATS = `SELECT openchats FROM users WHERE username='${username}'`

    connection.query(GET_CHATS,(err,result)=>{
        if(err){return console.log(err)}
        let friendsArr = result[0].openchats.split(';')
        for(let i=0;i<friendsArr.length;i++){
            if(friendsArr[i] == friendname.trim()){
                return res.json({data : 'false'})
            }
        }
        return connection.query(ADD_CHAT,(err,result)=>{
            if(err){return console.log(err)}
            return res.json({data : 'true'})
        })
    })
})


// -------- GET FRIEND REQUESTS ----------

app.get('/api/getfriendrequests',(req,res)=>{
    const { username } = req.query;
    const GET_REQ = `SELECT friendrequests FROM users WHERE username='${username}'`
    
    connection.query(GET_REQ,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({data : result})
    })
})


// -------  REMOVE FROM FRIEND REQUESTS ---------

app.get('/api/removefriendrequest',(req,res)=>{
    const { username, friendname} = req.query;
    const SELECT_ALL = `SELECT friendrequests FROM users WHERE username='${username}'`

    connection.query(SELECT_ALL,(err,result)=>{
        if(err){return console.log(err)}
        var fr = result[0].friendrequests.split(';')
        for(let i=1;i<fr.length;i++){
            if(fr[i] == friendname){
                fr[i] = ''
            }
        }
        fr = fr.join(';')
        if(fr == ';'){
            fr = ''
        }
        const REMOVE_USER = `UPDATE users SET friendrequests='${fr}' WHERE username='${username}'`

        connection.query(REMOVE_USER,(err,result)=>{
            if(err){return console.log(err)}
        })
    })
})


// -------- REMOVE OPEN CHAT ----------

app.get('/api/removeopenchat',(req,res)=>{
    const { username, friendname } = req.query;
    const SELECT_CHATS = `SELECT openchats FROM users WHERE username='${username}'`

    connection.query(SELECT_CHATS,(err,result)=>{
        if(err){return console.log(err)}
        let chats = result[0].openchats.split(';')
        console.log(chats)
        for(let i=1;i<chats.length;i++){
            console.log(chats[i])
            console.log(friendname)
            if(chats[i] == friendname){
                chats.splice(i,1)
            }
        }
        chats = chats.join(';')
        if(chats == ';'){
            chats = ''
        }
        console.log(chats)
        const REMOVE_CHAT = `UPDATE users SET openchats='${chats}' WHERE username='${username}'`
        
        connection.query(REMOVE_CHAT,(err,result)=>{
            if(err){return console.log(err)}
        })
    })
})


// ---------- ADD GROUP CHAT ----------


app.get('/api/addgroupchat',(req,res)=>{
    const { users, name, username } = req.query;
    const ADD_NEW_GROUP_CHAT = `INSERT INTO groupchats(messages,users,name) VALUES('"messages":{"message":["Server℗Group made by ${username}"]}','${users}','${name}')`

    var friends = users.split(';')
    var ADD_TO_FRIEND = ''
    var CHECK_FRIENDS = ''
    for(let i=1;i<friends.length;i++){
        CHECK_FRIENDS = `SELECT groupchats FROM users WHERE username='${friends[i]}'`
        connection.query(CHECK_FRIENDS,(err,result)=>{
            if(err){return console.log(err)}
            var ress = result[0].groupchats.split(';')
            for(let i=1;i<ress.length;i++){
                if(ress[i] == name){
                    return;
                }
            }
            ADD_TO_FRIEND = `UPDATE users SET groupchats= CONCAT(groupchats,';${name}') WHERE username='${friends[i]}'`
            connection.query(ADD_TO_FRIEND,(err,result)=>{
                if(err){return console.log(err)}
            })
            if(i == friends.length-1){
                connection.query(ADD_NEW_GROUP_CHAT,(err,result)=>{
                    if(err){return console.log(err)}
                })
            }
        })
    }
    return res.json({data : 'done'})
})


// --------- GET GROUP MESSAGES ----------

app.get('/api/getgroupmessages',(req,res)=>{
    const { name } = req.query;
    const SELECT_MESSAGES = `SELECT messages FROM groupchats WHERE name='${name}'`

    connection.query(SELECT_MESSAGES,(err,result)=>{
        if(err){return console.log(err)}
        if(result[0] != undefined){

            let StringObject = result[0].messages;
            let MessagesObject = false;
            try{
                MessagesObject = JSON.parse( "{" + StringObject + "}");
                
            }catch(err){
                MessagesObject = JSON.parse(StringObject);
            }
            return res.json({data : MessagesObject})
         }
    })
})



// ---------- SEND MESSAGE TO GROUP ----------

app.get('/api/sendmessagetogroup',(req,res)=>{
    const { group, username, message } = req.query;
    const GET_MESSAGES = `SELECT messages FROM groupchats WHERE name='${group}'`

    var finalsend = '';

    connection.query(GET_MESSAGES,(err,result)=>{
        if(err){return console.log(err)}
        let StringObject = result[0].messages
        let MessagesObject = false;
        try{
            MessagesObject = JSON.parse( "{" + StringObject + "}");
            
        }catch(err){
            MessagesObject = JSON.parse(StringObject);
        }
        console.log(MessagesObject)
        let newObject = `${username}℗${message}`
        console.log('aa')
        MessagesObject.messages.message[MessagesObject.messages.message.length] = newObject;
        let finalSave = JSON.stringify(MessagesObject);
        console.log(finalSave)
        var SEND_MESSAGE = `UPDATE groupchats SET messages='${finalSave}' WHERE name='${group}'`
        connection.query(SEND_MESSAGE,(err,result)=>{
            if(err){return console.log(err)}
            return res.json({data : finalSave})
        })
    })

})


// -------- LEAVE GC -------

app.get('/api/leavegroupchat',(req,res)=>{
    const { name, group } = req.query;
    const GET_USERS_FROM_GROUP = `SELECT users FROM groupchats WHERE name='${group}'`

    connection.query(GET_USERS_FROM_GROUP,(err,result)=>{
        if(err){return console.log(err)}
        var users = result[0].users.split(';')
        for(let i=1;i<users.length;i++){
            if(users[i] == name){
                users.splice(i,1)
            }
        }
        users = users.join(';')
        var UPDATE_USERS = `UPDATE groupchats SET users='${users}' WHERE name='${group}'`

        connection.query(UPDATE_USERS,(err,result)=>{
            if(err){return console.log(err)}
            var SELECT_GC = `SELECT groupchats FROM users WHERE username='${name}'`
            connection.query(SELECT_GC,(err,result)=>{
                if(err){return console.log(err)}
                let groupchats = result[0].groupchats.split(';')
                for(let i=1;i<groupchats.length;i++){
                    if(groupchats[i] == group){
                        groupchats.splice(i,1)
                    }
                }
                groupchats = groupchats.join(';')
                var UPDATE_GROUPCHATS = `UPDATE users SET groupchats='${groupchats}' WHERE username='${name}'`

                connection.query(UPDATE_GROUPCHATS,(err,result)=>{
                    if(err){return console.log(err)}
                    console.log(result)
                })
            })
        })
    })
})



app.listen(4000, ()=>{
    console.log('Listening');
})