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
    const ADD_USER = `INSERT INTO users(username,password,level,points) VALUES('${name}', '${password}',0,0)`
    const FIND_USER = `SELECT * FROM users WHERE username="${name}"`

    connection.query(FIND_USER,(err,result)=>{
        if(err){return console.log(err)}

        if(!result[0]){
            connection.query(ADD_USER,(err,results)=>{
                if(err){return console.log(err)}
                return res.json({ data : 'user added'});
            })
        }else{
            return res.json({ data : 'user exsists' });
        }
    })


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
    const GET_QUESTIONS = `SELECT * FROM challenges WHERE question LIKE '%${questionname}%'`

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

    console.log(code)

    code = code.replace('℗℗','++');
    code = code.replace('℗','+');

    solution = solution.replace(/℗/g, '\n')

    console.log(code)
    console.log(solution)
    
    runNode(code,'',cb = (err,result) => {
        if(result.substring(0,result.lastIndexOf("\n")) == solution){
            console.log('right')
            console.log(result.substring(0,result.lastIndexOf("\n")))
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n"))+'  >> correct', status : 'true'})
        }else{
            console.log('wrong')
            console.log(result.substring(0,result.lastIndexOf("\n")))
            return res.json({ data :  result.substring(0,result.lastIndexOf("\n")) +'  >> wrong', status : 'false'})
        }
    })

})



// -------- GET MESSAGES --------

app.get('/api/getmessages',(req,res)=>{
    const { language } = req.query;
    const GET_MESSAGES = `SELECT * FROM messages WHERE language='${language}'`

    connection.query(GET_MESSAGES,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result })
    })
})

// -------- SEND MESSAGE ---------

app.get('/api/sendmessage',(req,res)=>{
    const { language, message, user } = req.query;
    const SEND_MESSAGE = `INSERT INTO messages(language, message, user) VALUES('${language}','${message}','${user}')`

    connection.query(SEND_MESSAGE,(err,result)=>{
        if(err){return console.log(err)}

        return res.send('sent');
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




app.listen(4000, ()=>{
    console.log('Listening');
})