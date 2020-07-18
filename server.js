// imports
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const port = process.env.PORT || 3001
const app = express()

// middleware - JSON parsing
app.use(express.json())

// middleware - cors
const corsOptions = {
  origin:[`http://localhost:3000`, 'https://gayme-it.herokuapp.com'],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// middleware - session config
app.use(session({
    // store the session in our DB
    store: new MongoStore({ url: process.env.MONGODB_URI || "mongodb://localhost:27017/gaymers" }),
    secret: "ILikePizza",
    resave: false,
    // Only create a session if a property is added to the session
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use('/api/v1/post', routes.post)
app.use('/api/v1/auth', routes.auth)
  

app.listen(port, () => console.log(`Server is running on port ${port}`))