const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const safeEval = require('safe-eval');

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


//----- RUN CODE ------

app.get('/api/runcode',(req,res)=>{
    const { code } = req.query;
    return res.send(eval('2+2'));
})


app.listen(4000, ()=>{
    console.log('Listening');
})