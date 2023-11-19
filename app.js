require("dotenv").config();

const app = require('express')();
var http = require('http').Server(app);

// const paymentRoute = require('./Routes/paymentRoute');

// app.use('/',paymentRoute);

// http.listen(3000, function(){
//     console.log('Server is running');
// });