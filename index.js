const config= require('./config');
const express= require('express');
const bodyParser= require('body-parser');


let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./controller/main'));

app.listen(config.port,"0.0.0.0",(err)=>{
    
    console .log("Server Running on Port ",config.port)
});
