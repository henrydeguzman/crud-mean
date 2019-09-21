const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();
mongoose.set('useNewUrlParser', true); // suggested from terminal
mongoose.set('useUnifiedTopology', true); // suggested from terminal
mongoose.connect("mongodb+srv://rnw:1ybMjv6mMUCMI5SV@cluster0-gyh6x.mongodb.net/crud-mean?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to databse!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json()); app.use(bodyParser.urlencoded({extended:false}));
// activate to accessible.
app.use("/uploads/images", express.static(path.join("backend/uploads/images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods',"GET,PUT, POST, PATH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts",postsRoutes);
module.exports = app;
