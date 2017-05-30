const express = require('express');
const compression = require('compression');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const router = require('./app/router.js');
const passportConfig = require('./config/passport.js');

let app = express();

app.use(session({
    store: new RedisStore({ client: redis.createClient(process.env.REDIS_URL) }),
    secret: 'learninghowtousepassporjsgoogle',
    name: 'passport_google',
    cookies: {
        secure: false,
        maxAge: 3600000,
    },
    saveUninitialized: false,
    resave: false
}));

app.use(cookieParser());
app.use(compression());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

router(passport, app);
passportConfig(passport);

app.listen((process.env.PORT || 3000), () => {
    console.log('server running at http://localhost:3000/');
});