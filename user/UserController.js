const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('../config.js');
const jwt = require('jsonwebtoken');
localStorage = new LocalStorage('./scratch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const User = require('./User');
const News = require('./News');



// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});


// GETS A SINGLE USER FROM THE DATABASE
router.get('/newsForm', (req, res) => {
    var token = localStorage.getItem('authtoken')
    console.log("token>>>", token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        console.log(decoded);
        if (err) {
            res.redirect('/')
        };
        User.findById(decoded.id, { password: 0 }, (err, user) => {
            if (err) { res.redirect('/') }
            if (!user) { res.redirect('/') }
            const mode = req.query.mode || '';
            if (mode) {
                News.find((err, news) => {
                    if (err) throw err;
                    res.render('newsForm.ejs', { user, news, mode })
                });
            } else
                res.render('newsForm.ejs', { user, mode });
        });
    });
});

router.post('/addNews', (req, res) => {
    News.create({
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        imageUrl: req.body.imageUrl,
        published: moment()
    },
        (err, user) => {
            if (err) return res.status(500).send("There was a problem in adding the news.")
            res.redirect('/admin/newsForm');
        });
});
router.post('/admin/find_by_id', (req, res) => {
    News.findById({ _id: req.body.id }, (err, news) => {
        if (err) res.status(500).send({ message: 'error' });
        res.send(news);
    });
});
router.put('/admin/update_by_id', (req, res) => {
    News.findByIdAndUpdate(req.body.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            imageUrl: req.body.imageUrl,
            published: req.body.published
        }
    }, {
        upsert: true
    }, (err, news) => {
        if (err) res.status(500).send({ message: 'error' });
        res.send(news);
    });
});
router.delete('/admin/delete_by_id', (req, res) => {
    News.findByIdAndDelete(req.body.id, (err, news) => {
        if (err) res.status(500).send({ message: 'error' });
        res.send(news);
    });
});
router.get('/logout', (req, res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})

module.exports = router;