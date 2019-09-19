const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {
            error = null;
        }
        cb(error, "backend/uploads/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ext);
    }
});

router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const posts = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath:  url + '/uploads/images/' +req.file.filename
    });
    posts.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...result,
                id: result._id
            }
        });
    });
});

router.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
    console.log(req.file);
    let imagepath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagepath= url + '/uploads/images/' + req.file.filename;
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagepath
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
    console.log(req.query);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
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
