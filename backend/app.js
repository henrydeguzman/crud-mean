const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://rnw:1ybMjv6mMUCMI5SV@cluster0-gyh6x.mongodb.net/crud-mean?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to databse!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json()); app.use(bodyParser.urlencoded({extended:false}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods',"GET,PUT, POST, PATH, DELETE, OPTIONS");
    next();
});

app.post("/api/posts", (req, res, next) => {
    //const posts = req.body;
    const posts = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log("what is this?");
    //console.log(posts);
    posts.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post added successfully',
            id: result._id
        });
    });
});

app.put("/api/posts/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id},post).then(result => {
        console.log(result);
        res.status(200).json({message: "update Successful!"});
    });
});

app.get("/api/posts", (req, res, next) => {
    // const posts = [
    //     {id: 'asdfasdf', title: 'first server-side posts', content: 'first content'},
    //     { id: '111', title: 'second server-side posts', content: 'second content' }
    // ];
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'posts fetched sucessfully',
                posts: documents
            });
        });
});

app.delete("/api/posts/:id", (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Deleteed!'
        });
    });
});

module.exports = app;
