const express = require('express');
const session = require('express-session')
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
dotenv.config();
const adminRouter = require('./routers/admin/adminRouter');
const mainRouter = require('./routers/router');
const db = require('./db/connection');
const fileUpload = require('express-fileupload');

const app = express();
const IN_PROD = process.env.NODE_ENV === 'production';
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());
app.use(session({
    name:process.env.SESSION_NAME,
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET,
    cookie:{
        path: '/',
        maxAge: Number(process.env.LIFESPAN) * 1000,
        sameSite:true,
        secure:process.env.IN_PRO
    }
}));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));


app.use('/',mainRouter);
app.use('/admin',adminRouter);
 
const port = process.env.PORT || 5000;

app.listen(port, (error) => {
    if(error){
        return console.log(error);
    }
    console.log('Server is up and running on port 5000!');
});