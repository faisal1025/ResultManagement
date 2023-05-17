const path = require('path')
const express = require('express')
require('./database/connection');
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 8080

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Post Requests
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 

// Static Files and Routes
app.use(express.static(path.join(__dirname, 'static')))
app.use('/', require(path.join(__dirname, 'routers/resultManagement')));

app.listen(port, '0.0.0.0', ()=>{
    console.log(`app listening on port ${port}`)
})