var router = (passport, app) => {

    app.get('/', (req, res) => {
        if(!req.user) {
            res.render('./index.ejs');
            return;
        } else {
            res.redirect('/profile');
        }
    });

    app.get('/login', (req, res) => {
        if(!req.user) {
            res.render('./login.ejs');
            return;
        } else {
            res.redirect('/profile');
        }
    });

    app.get('/profile', (req, res) => {
        if(req.user) {
            res.render('./profile.ejs', {user: req.user});
            return;
        } else {
            res.redirect('/login');
        }
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'], session: true }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/',
            session: true
        }));

    app.get('/logout', (req, res) => {
        if(req.user) {
            req.logout();
        }
        res.redirect('/');
    });
};

module.exports = router;