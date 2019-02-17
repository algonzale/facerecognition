const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');
const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'password',
    database: 'smart-brain'
  }  	
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> res.send(database.users))
//signin
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));
//register
app.post('/register', (req, res) => register.handleRegistration(req, res, db, bcrypt));
//profile
app.get('/profile/:id',(req, res) => profile.handleProfile(req, res, db));
//image
app.put('/image', (req, res) => image.handleImageSubmit(req, res, db));
app.put('./imageurl', (req, res) => image.handleAPI(req, res));


const PORT = process.env.PORT;
app.listen(PORT, ()=> {
	console.log(PORT);
})
