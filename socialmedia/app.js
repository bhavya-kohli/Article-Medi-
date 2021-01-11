const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const connectDB=require('./config/db');
const morgan = require('morgan');
const exphbs=require('express-handlebars');
const indexRoutes=require('./routes/index');
const path=require('path');
const session=require('express-session')
const passport = require('passport');
const { parseWithoutProcessing } = require('handlebars');
const MongooStore=require('connect-mongo')(session);
const bodyParser=require('body-parser');
//load config
dotenv.config({path:'./config/config.env'});

//passport config
require('./config/passport')(passport);

//connection
connectDB();
const app=express();

if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'));
}

//Handlerbars helpers
const {formatDate,stripTags,truncate,editIcon,select}=require('./helpers/hbs');

//setting middleware for expree handlebars
app.engine('.hbs', exphbs({
    helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout: 'main',
    extname:'.hbs'}));
app.set('view engine', '.hbs');

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new MongooStore({
        mongooseConnection:mongoose.connection
    })
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global variable
app.use(function(req,res,next){
    res.locals.user=req.user || null
    next()
});


//static folder
app.use(express.static(path.join(__dirname,'public'))); 

//establishing body parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));


//@routes
app.use('/',indexRoutes);
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));

app.listen(process.env.PORT|| 5000,()=>{
    console.log(`server up and running in ${process.env.NODE_ENV} on port ${process.env.PORT|| 5000}`);
})