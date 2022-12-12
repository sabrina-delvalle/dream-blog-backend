require('dotenv').config();
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
//const cors = require('cors');
const bodyParser = require('body-parser');
//const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
var favicon = require('serve-favicon')
var path = require('path')
const { PORT } = process.env;

/* app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:3000`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    //res.setHeader('Access-Control-Expose-Headers', '*, Authorization')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type',  'Set-Cookie', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-XSRF-TOKEN, XSRF-TOKEN, *"
      );
    next();
}); */
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

mongoose.set('strictQuery', false);

app.use(favicon(path.join(__dirname, 'ico', 'favicon.ico')))

app.use('/', require('./routes/posts'))

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        app.listen(PORT, () => console.log(`Listening port ${PORT}` ))
    })
    .catch(err => console.log(err))