const express = require('express');
const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const app = express();
// For parsing form
const bodyParser = require('body-parser');
// For generating Token
const jwt = require('jsonwebtoken');
// For encrypting Password
const bcrypt = require('bcryptjs');
// For Secert Token
const config = require('../config');
// For User Schema
const User = require('../user/User');
const session = require('express-session');

router.use(session({ secret: 'rajeshproject', resave: false, saveUninitialized: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './views');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Register User
router.post('/register', (req, res) => {

  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  },
    (err, user) => {
      if (err) return res.status(500).send("There was a problem registering the user.")
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.redirect('/?msg=' + encodeURIComponent('Successfully Registered! Please Login'));
    });
});

// Login User
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    const string = encodeURIComponent('! Please enter valid value');
    if (!user) { res.redirect('/?valid=' + string); }
    else {
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      localStorage.setItem('authtoken', token)
      res.redirect(`/admin/newsForm`);
    }
  });
});
module.exports = router;