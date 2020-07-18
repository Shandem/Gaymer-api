const db = require('../models')
const bcrypt = require('bcrypt')

const register = (req, res) => {
  // validation of the POSTed data (make sure the user has a name, email, and pw)
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
        status: 400,
        message: "Please enter a name, email, and password"
    })
  }

  // make sure user does not already exist
  db.User.findOne({ email: req.body.email }, (err, foundUser) => {
    // error checking for a problem with the server or DB
    if (err) return res.status(500).json({
      status: 500,
      message: 'Something went wrong. Please try again.'
    })

    // if a user is found, return a response
    if (foundUser) return res.status(400).json({
      status: 400,
      message: "A user with that email address already exists!"
    })

    // Generate a safe password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json({
        status: 500,
        message: 'Something went wrong. Please try again.'
      })

      // Hash the user's password using the salt that was generated
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.status(500).json({
          status: 500,
          message: 'Something went wrong. Please try again.'
        })

        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: hash
        }

        db.User.create(newUser, (err, savedUser) => {
          if (err) return res.status(500).json({ status: 500, message: err })
          return res.status(200).json({ status: 200, message: "User registered!" })
        })
      })
    })
  })
}

const login = (req, res) => {
  // console.log(req.body);
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ status: 400, message: 'Please enter your email and password' });
  }

  db.User.findOne({email: req.body.email}, (err, foundUser) => {
    if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again' });

    if (!foundUser) {
      return res.status(400).json({ status: 400, message: 'Email or password is incorrect'});
    }

    bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
      if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again' });

      if (isMatch) {
        req.session.currentUser = { id: foundUser._id };
        return res.status(200).json({ status: 200, message: 'Success', data: foundUser._id });
      } else {
        return res.status(400).json({ status: 400, message: 'Email or password is incorrect' });
      }
    });
  });
}

const verify = (req, res) => {
  if (!req.session.currentUser) return res.status(401).json({
    message: 'Unauthorized!'
  })
  res.status(200).json({
    message: `Current user verified with ID ${ req.session.currentUser.id }`
  })
}

const logout = (req, res) => {
  if (!req.session.currentUser) return res.status(401).json({
    message: 'No user to log out!'
  })
  req.session.destroy(err => {
    if (err) return res.status(500).json({
      message: 'Something went wrong. Please try again.'
    })
    res.sendStatus(200)
  })
}

module.exports = {
  register,
  login,
  verify,
  logout
}