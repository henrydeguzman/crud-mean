const express = require('express');
const Post = require('../models/post');
const router = express.Router();

router.post("", (req, res, next) => {
    const posts = new Post({
        title: req.body.title,
        content: req.body.content
    });
    posts.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post added successfully',
            id: result._id
        });
    });
});

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({ message: "update Successful!" });
    });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(postd => {
        if (postd) {
            res.status(200).json(postd);
        }
        else {
            res.status(404).json({ message: 'Post not found!' })
        }
    });
});

router.get("", (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'posts fetched sucessfully',
                posts: documents
            });
        });
});

router.delete("/:id", (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Deleteed!'
        });
    });
});
module.exports = router;
