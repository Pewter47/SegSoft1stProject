const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const app = express();

// Setup session middleware
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Your strategy
const strategy = new OAuth2Strategy(
  {
    authorizationURL: 'http://localhost:3000/authorize',
    tokenURL: 'http://localhost:3000/token',
    clientID: 'my-client2',
    clientSecret: 'secret2',
    callbackURL: 'http://localhost:3001/auth/provider/callback',
    state: true,
    customHeaders: {
      Authorization: 'Basic ' + Buffer.from('my-client2:secret2').toString('base64'),
    }
  },
  (accessToken, refreshToken, profile, cb) => {
    const user = { accessToken, refreshToken };
    return cb(null, user);
  }
);

passport.use('provider', strategy);

// Routes
app.get('/', (req, res) => res.redirect('/auth/provider'));

app.get('/auth/provider', (req, res, next) => {
  passport.authenticate('provider', {
    scope: 'email',
    prompt: 'login',
  })(req, res, next);
});

app.get(
  '/auth/provider/callback',
  passport.authenticate('provider', { failureRedirect: '/' }),
  (req, res) => {
    res.send(`Logged in! Access Token: ${req.user.accessToken}`);
  }
);

// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
